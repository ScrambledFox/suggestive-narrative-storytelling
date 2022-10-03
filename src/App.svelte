<script>
  import StoryState from "./StoryState.svelte";
  import Prompt from "./lib/Prompts/Prompt.svelte";
  import Intro from "./lib/Prompts/Intro.svelte";
  import OpinionCards from "./lib/Prompts/OpinionCards.svelte";
  import OpinionForm from "./lib/OpinionForm.svelte";
  import Footer from "./lib/Footer.svelte";

  import Ink from "inkjs";
  import storyJson from "./assets/test.json";
  import { v4 as uuidv4 } from "uuid";

  import { onMount } from "svelte";
  import { detach } from "svelte/internal";
  import Choice from "./lib/Prompts/Choice.svelte";

  import * as js from "jquery";

  let Story = new Ink.Story(storyJson);

  const getData = async () => {
    let response = await fetch(
      "https://data.id.tue.nl/datasets/downloadPublic/json/" +
        "U1Q4cEwrWlViem0rWVFndSs4cnM2UT09",
      {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
      }
    );

    return await response.json();
  };

  const setResourceWithResourceId = (id, data) => {
    js.ajax({
      url: "https://data.id.tue.nl/datasets/entity/2793/item/",
      headers: {
        api_token:
          "Q292bk9FMStweWlzMTM0ZXZILzBqcHpMV2ZzSlJNKzdleW52NThKbTJtTT0=",
        resource_id: id,
        token: "Q292bk9FMStweWlzMTM0ZXZILzBqcHpMV2ZzSlJNKzdleW52NThKbTJtTT0=",
      },
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function (data) {
        console.log("CHOICE DATA UPDATED", data);
        return data;
      },
      error: function (e) {
        console.error(e);
      },
    });
  };

  const getOpinionsWithPromptId = async (id) => {
    let json = await getData();
    return json.filter((o) => {
      return o.opinionId === id;
    });
  };

  const getNextStoryState = async () => {
    if (Story.canContinue) {
      let nextLine = Story.Continue();
      console.log(Story);

      let opinionId = 0;
      let tag = Story.currentTags.find((tag) => tag.includes("choice_id"));
      if (tag !== undefined) {
        opinionId = parseInt(tag.split("=")[1]);
      }

      // Get choice data.
      let ids = [];
      let cds = await getData();
      for (let i = 0; i < Story.currentChoices.length; i++) {
        ids.push("choice_data_" + (opinionId * 10 + i));
      }

      cds = cds.filter((c) => {
        return ids.includes(c.resource_id);
      });

      cds.sort(function (a, b) {
        let idA = parseInt(a.resource_id.split("_")[2]);
        let idB = parseInt(b.resource_id.split("_")[2]);
        return idA < idB ? -1 : idA > idB ? 1 : 0;
      });

      cds.forEach((element) => {
        let val = parseInt(element.resource_id.split("_")[2]);
        element.opinionId = Math.floor(val / 10);
        element.index = val % 10;
      });

      // Total up
      let total = 0;
      cds.forEach((cd) => {
        total += cd.chosen;
      });

      let data = {
        prompt: nextLine,
        choices: Story.currentChoices,
        choiceData: cds,
        totalChosen: total,
        opinions: await getOpinionsWithPromptId(opinionId),
        opinionId: opinionId,
      };

      console.log(data);
      return data;
    }

    return null;
  };

  const makeChoice = async (e) => {
    Story.ChooseChoiceIndex(e.detail.index);

    console.log("Make choice", currentState, e.detail);

    // Update choice rate.
    let id = "choice_data_" + (currentState.opinionId * 10 + e.detail.index);

    let cds = await getData();
    let cd = cds.find((c) => c.resource_id === id);

    console.log("CD", cd);

    if (cd !== undefined) {
      cd.chosen++;
      setResourceWithResourceId(id, cd);
    } else {
      setResourceWithResourceId(id, { chosen: 1 });
    }

    currentState.lastMadeChoice = e.detail.choice;
    currentState.lastMadeChoiceIndex = e.detail.index;

    if (currentState.opinionId == 0) {
      LoadNextState();
    } else {
      currentState.askOpinion = true;
    }
  };

  const agreeWithOpinion = async (e) => {
    // Get opinions
    let ops = await getData();

    // Select
    ops = ops.find((o) => o.resource_id === e.detail.opinion.resource_id);
    console.log("OPS", ops);

    // Adapt
    ops.agreedTimes++;

    // Update
    js.ajax({
      url: "https://data.id.tue.nl/datasets/entity/2793/item/",
      headers: {
        api_token:
          "Q292bk9FMStweWlzMTM0ZXZILzBqcHpMV2ZzSlJNKzdleW52NThKbTJtTT0=",
        resource_id: ops.resource_id,
        token: "Q292bk9FMStweWlzMTM0ZXZILzBqcHpMV2ZzSlJNKzdleW52NThKbTJtTT0=",
      },
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(ops),
      success: function (data) {
        console.log("UPDATED", data);
      },
      error: function (e) {
        console.log(e);
      },
    });

    // Continue
    LoadNextState();
  };

  const saveNewOpinion = (e) => {
    if (e.detail.opinion == "") return;

    let data = {
      opinion: e.detail.opinion,
      opinionId: currentState.opinionId,
      choice: currentState.prompt,
      choiceId: currentState.lastMadeChoiceIndex,
      agreedTimes: 0,
    };

    js.ajax({
      url: "https://data.id.tue.nl/datasets/entity/2793/item/",
      headers: {
        api_token:
          "Q292bk9FMStweWlzMTM0ZXZILzBqcHpMV2ZzSlJNKzdleW52NThKbTJtTT0=",
        resource_id: uuidv4(),
        token: "Q292bk9FMStweWlzMTM0ZXZILzBqcHpMV2ZzSlJNKzdleW52NThKbTJtTT0=",
      },
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function (data) {
        console.log(data);
      },
      error: function (e) {
        console.error(e);
      },
    });

    LoadNextState();
  };

  let currentState = null;
  const LoadNextState = async () => {
    currentState = await getNextStoryState();
  };

  // Get first line.
  LoadNextState();
</script>

<main>
  {#if currentState !== null}
    {#if currentState.askOpinion}
      <OpinionForm
        choiceText={currentState.lastMadeChoice.text}
        choiceIndex={currentState.lastMadeChoiceIndex}
        opinions={currentState.opinions.filter((o) => {
          return o.choiceId === currentState.lastMadeChoiceIndex;
        })}
        on:opinion:submitted={(e) => saveNewOpinion(e)}
        on:opinion:agreed={(e) => agreeWithOpinion(e)}
      />
    {:else}
      <StoryState
        state={currentState}
        on:choice:confirmed={(e) => makeChoice(e)}
        on:story:continue={LoadNextState}
      />
    {/if}
  {:else}
    <Intro text="The end." />
  {/if}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 300px;
    margin: 0 auto;

    --cursor-color: white;
  }

  center {
    margin: 0;
    position: absolute;

    top: 50%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 3em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
