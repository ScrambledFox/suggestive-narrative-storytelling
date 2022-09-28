<script>
  import StoryState from "./StoryState.svelte";
  import Prompt from "./lib/Prompts/Prompt.svelte";
  import Intro from "./lib/Prompts/Intro.svelte";
  import Footer from "./lib/Footer.svelte";

  import Ink from "inkjs";
  import OpinionCards from "./lib/Prompts/OpinionCards.svelte";

  import storyJson from "./assets/test.json";

  let Story = new Ink.Story(storyJson);

  const getNextStoryState = () => {
    if (Story.canContinue) {
      return {
        prompt: Story.Continue(),
        choices: Story.currentChoices,
      };
    }

    return null;
  };

  const makeChoice = (index) => {
    Story.ChooseChoiceIndex(index);

    currentState = getNextStoryState();
  };

  // Get first line.
  let currentState = getNextStoryState();
</script>

<!-- <svelte:head>
  <script
    src="https://data.id.tue.nl/api/v1/1335/anonymousParticipation.js"
    on:load={initializeParticipation}>
  </script>
</svelte:head> -->

<main>
  <StoryState
    state={currentState}
    on:choice:confirmed={(e) => makeChoice(e.detail.index)}
    on:story:continue={() => (currentState = getNextStoryState())}
  />

  <!-- <Prompt prompt={prompts[currentPrompt]} opinions={testOpinions} /> -->

  <!-- <OpinionCards opinions={testOpinions} /> -->
  <Footer />
</main>

<style>
  main {
    height: calc(90vh);
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
