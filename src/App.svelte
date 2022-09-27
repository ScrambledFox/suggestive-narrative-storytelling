<script>
  // import json from "../inkyy.json";

  import Prompt from "./lib/Prompts/Prompt.svelte";
  import Footer from "./lib/Footer.svelte";

  import Story from "inkjs";

  const prompt1 = {
    intro: "",
    question: "The year is 2050. You look outside your window and see...",
    answers: [
      "People wearing gasmasks, standing in line to get more food rations.",
      "Factories keeping the world together to sustain the consumerist lifestyles.",
      "A green oasis with children joyfully playing outside.",
    ],
    canHaveOpinion: false,
  };

  const prompt2 = {
    intro:
      "You live in a world depended on local factories. You happen to work at one of these factories, which provides you with just enough income to live. However, your factory is a major pollutant for its environment and people living nearby are not able to grow any crops which is causing them to starve.",
    question:
      "You have the option to close the factory out of empathy for the neighboring community that are affected by the pollution. Or you can keep the factory open to keep supporting you own small community of factory workers.",
    answers: ["Close it.", "Keep it open."],
    canHaveOpinion: true,
  };

  let participantLoaded = false;

  const initializeParticipation = () => {
    if (DF !== undefined && DF.participant.id !== -1) {
      participantLoaded = true;
    }

    // TESTING
    participantLoaded = true;
    // TESTING
  };
</script>

<svelte:head>
  <script
    src="https://data.id.tue.nl/api/v1/1335/anonymousParticipation.js"
    on:load={initializeParticipation}>
  </script>
</svelte:head>

<main>
  {#if participantLoaded}
    <Prompt prompt={prompt1} />
  {:else}
    <h1>Uh oh.</h1>
    <p>Seems that something went wrong, please try to reload the page.</p>
  {/if}
  <Footer />
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 300px;
    margin: 0 auto;
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
