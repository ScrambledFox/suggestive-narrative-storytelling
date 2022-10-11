<script>
  import StoryState from "./StoryState.svelte";
  import Intro from "./lib/Prompts/Intro.svelte";
  import OpinionForm from "./lib/OpinionForm.svelte";

  import Ink from "inkjs";
  import storyJson from "./assets/test.json";
  import { v4 as uuidv4 } from "uuid";

  import * as js from "jquery";
  import Form from "./lib/Form.svelte";

  let Story = new Ink.Story(storyJson);

  const POST_API_TOKEN =
    "ZzlWcTMxbDN5MkJyT3ZjclI3ai9lQnNock8ySTlBUkUxNk5YUUdxTjNlaz0=";
  const JSON_DOWNLOAD_TOKEN =
    "UWljcUJpVjNDMWc4NTl6dndJOGxLcjljaG81WldkMW1sd1lwbTNRNmY0dz0=";
  const DB_ID = 2821;

  const urlParams = new URLSearchParams(window.location.search);

  // First check if people accessed this site in the correct way. (Or using the dev tag)
  let accessAllowed = false;
  const timestamp = urlParams.get("token");
  if (new Date().getTime() < timestamp || urlParams.has("dev")) {
    accessAllowed = true;
  }

  // Get participant id
  let participantId = "not_registered_" + uuidv4();
  if (urlParams.has("id")) {
    participantId = urlParams.get("id");
  }

  // Check for suggestive narrative
  let enableSuggestiveComponent = urlParams.has("sgstv");
  let showChoicePercentages = urlParams.has("sgstv");

  // Fetches all data from DF.
  const getData = async () => {
    let response = await fetch(
      "https://data.id.tue.nl/datasets/downloadPublic/json/" +
        JSON_DOWNLOAD_TOKEN,
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

  // Sets a DF DB record with the id and rewrites its data to data.
  const setResourceWithResourceId = (id, data) => {
    js.ajax({
      url: "https://data.id.tue.nl/datasets/entity/" + DB_ID + "/item/",
      headers: {
        api_token: POST_API_TOKEN,
        resource_id: id,
        token: POST_API_TOKEN,
      },
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function (data) {
        return data;
      },
      error: function (e) {
        console.error(e);
      },
    });
  };

  // Gets opinions for a prompt.
  const getOpinionsWithPromptId = async (id) => {
    let json = await getData();
    return json.filter((o) => {
      return o.opinionId === id;
    });
  };

  // Cycles to next story state.
  const getNextStoryState = async () => {
    if (Story.canContinue) {
      let nextLine = Story.Continue();

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
        participantId: participantId,
      };

      return data;
    }

    return null;
  };

  // Makes a choice
  const makeChoice = async (e) => {
    let choices = Story.currentChoices;
    Story.ChooseChoiceIndex(e.detail.index);

    // Update choice data.
    let id = "choice_data_" + (currentState.opinionId * 10 + e.detail.index);

    let cds = await getData();
    let cd = cds.find((c) => c.resource_id === id);

    if (cd !== undefined) {
      cd.chosen++;
      setResourceWithResourceId(id, cd);
    } else {
      let choiceData = {
        type: "staticChoiceData",
        chosen: 1,
      };
      setResourceWithResourceId(id, choiceData);
    }

    // Save seperate record.
    let choiceRecordData = {
      type: "choiceMade",
      participantId: participantId,
      promptOpinionId: currentState.opinionId,
      madeChoiceId: e.detail.index,
      prompt: currentState.prompt,
      choice: choices[e.detail.index].text,
    };
    setResourceWithResourceId(
      "choice_made_record_" + uuidv4(),
      choiceRecordData
    );

    currentState.lastMadeChoice = e.detail.choice;
    currentState.lastMadeChoiceIndex = e.detail.index;

    if (currentState.opinionId === 0) {
      LoadNextState();
    } else {
      currentState.askOpinion = true;
    }
  };

  // Agrees with an opinion.
  const agreeWithOpinion = async (e) => {
    // Get opinions
    let ops = await getData();

    // Select
    ops = ops.find((o) => o.resource_id === e.detail.opinion.resource_id);

    // Adapt
    ops.agreedTimes++;

    // Update
    js.ajax({
      url: "https://data.id.tue.nl/datasets/entity/" + DB_ID + "/item/",
      headers: {
        api_token: POST_API_TOKEN,
        resource_id: ops.resource_id,
        token: POST_API_TOKEN,
      },
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(ops),
      success: function (data) {},
      error: function (e) {
        console.log(e);
      },
    });

    // Save seperate record.
    let agree_data = {
      type: "agreedWith",
      participantId: participantId,
      agreedWithOpinionId: ops.resource_id,
    };
    setResourceWithResourceId("agreed_record_" + uuidv4(), agree_data);

    // Continue
    LoadNextState();
  };

  // Saves a new opinion.
  const saveNewOpinion = (e) => {
    if (e.detail.opinion == "") return;

    let data = {
      type: "opinionGiven",
      opinion: e.detail.opinion,
      opinionId: currentState.opinionId,
      choice: currentState.prompt,
      choiceId: currentState.lastMadeChoiceIndex,
      agreedTimes: 0,
      writtenByParticipant: participantId,
    };

    js.ajax({
      url: "https://data.id.tue.nl/datasets/entity/" + DB_ID + "/item/",
      headers: {
        api_token: POST_API_TOKEN,
        resource_id: "opinion_" + uuidv4(),
        token: POST_API_TOKEN,
      },
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function (data) {},
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

  let hadIntro = false;

  // Get first line.
  LoadNextState();
</script>

<main>
  {#if accessAllowed}
    {#if currentState !== null}
      {#if !hadIntro}
        <Intro
          on:story:continue={() => {
            hadIntro = true;
          }}
          text={[
            'This is a "choose your own adventure" game. Your decisions and choices will influence the ending you will get.',
            "You’ll start this game by choosing a perspective on a world. Each perspective offers an interesting look on the future. After that, each choice will determine the outcome of your unique story.",
            "You have the perspective of someone who leads a community in that world you chose. You will face several ethical problems or difficult decisions. Choose the option that you feel is right or you feel the most comfortable with.",
            "During this game, you have the option to share your own opinion on different choices.",
            enableSuggestiveComponent
              ? "You will be able to see the opinions of others on the subject and future players will be able to see your opinion on the matter."
              : "",
          ]}
        />
      {:else if currentState.askOpinion}
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
          suggestiveEnabled={enableSuggestiveComponent}
          {showChoicePercentages}
          on:choice:confirmed={(e) => makeChoice(e)}
          on:story:continue={LoadNextState}
        />
      {/if}
    {:else}
      <!-- <Intro text="The end." /> -->
      <Form {participantId} />
    {/if}
  {:else}
    <h1>Uh oh!</h1>
    <p>
      It seems that you've accessed this website in a dissallowed way, or you
      might have reloaded the page.
    </p>
    <p>
      Please relaunch the study via the Data Foundry Dashboard which you can
      find in your e-mail!
    </p>
  {/if}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 300px;
    margin: 0 auto;

    --cursor-color: white;
    line-height: 150%;
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
