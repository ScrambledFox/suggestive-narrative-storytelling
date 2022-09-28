<script>
  import Prompt from "./lib/Prompts/Prompt.svelte";
  import Intro from "./lib/Prompts/Intro.svelte";
  import Footer from "./lib/Footer.svelte";

  import Ink from "inkjs/dist/ink.js";
  import OpinionCards from "./lib/Prompts/OpinionCards.svelte";

  import storyJson from "./assets/Story.ink.json.txt";

  let currentPrompt = 1;

  let story = new Ink.Story(storyJson);

  const prompts = [
    {
      question: "The year is 2050. You look outside your window and see...",
      answers: [
        "People wearing gasmasks, standing in line to get more food rations.",
        "Factories keeping the world together to sustain the consumerist lifestyles.",
        "A green oasis with children joyfully playing outside.",
      ],
      canHaveOpinion: false,
    },
    {
      question:
        "You have the option to close the factory out of empathy for the neighboring community that are affected by the pollution. Or you can keep the factory open to keep supporting you own small community of factory workers.",
      answers: ["Close it.", "Keep it open."],
      canHaveOpinion: true,
    },
  ];

  const testOpinions = [
    {
      answer: 0,
      text: "I don't think so.",
    },
    {
      answer: 0,
      text: "That is weird.",
    },
    {
      answer: 1,
      text: "Your opinion is wrong",
    },
    {
      answer: 1,
      text: "That's a weird choice.",
    },
    {
      answer: 1,
      text: "I make great pasta, so therefore the other answer is not ethical at all.",
    },
    {
      answer: 1,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam id feugiat dolor. Aenean congue leo posuere, tincidunt nulla ut, imperdiet nibh. Nulla facilisi. Aliquam ut sem lectus. Mauris vitae urna lacinia, dapibus lectus nec, ullamcorper erat. Mauris ultrices eget erat vel dictum. Nulla at varius elit. Cras sed luctus neque.",
    },
  ];

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
  <!-- {#if participantLoaded}
      <Prompt prompt={prompts[currentPrompt]} opinions={testOpinions} />
    {:else}
      <h1>Uh oh.</h1>
      <p>Seems that something went wrong, please try to reload the page.</p>
    {/if} -->

  <Intro
    text={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque tempor ex in quam molestie, vitae ultricies lectus euismod. Integer ac ex imperdiet, rhoncus augue eu, volutpat lorem. Suspendisse luctus purus eros, vitae volutpat dui accumsan sagittis. Fusce accumsan accumsan accumsan. Phasellus vestibulum mollis turpis sit amet euismod. Duis hendrerit, eros faucibus euismod tincidunt, massa sapien tempus sapien, quis sollicitudin turpis erat non arcu. Nullam ut hendrerit justo. Aenean vitae eros dolor. Donec in magna sit amet sapien aliquet semper id et nibh. Suspendisse elementum sem vitae tincidunt fermentum. Phasellus sit amet elit ipsum. Fusce sit amet mi eget lacus pellentesque dignissim. Vivamus dictum vel enim ac faucibus. Morbi sed aliquet arcu, quis euismod nisl. Vestibulum scelerisque pharetra ligula, a porttitor metus semper et. Sed non eros tincidunt, porttitor enim at, cursus felis. Suspendisse pharetra eget dolor vel maximus. Proin convallis enim non quam egestas, eu facilisis ligula luctus. Mauris dapibus risus sit amet ex congue, sodales porttitor neque tempor. Ut in euismod arcu, vel faucibus tellus. Integer eu justo at leo sagittis dictum. Nullam scelerisque lorem eu arcu tincidunt maximus. Donec at mi dignissim, tempor nisl quis, lobortis metus. Donec elit sem, porttitor ac mauris nec, posuere mollis mi. Curabitur blandit lorem nec malesuada tincidunt. Etiam urna libero, viverra quis elit sit amet, dignissim sagittis nisi. Praesent eu interdum mi. Nam ut velit cursus, tincidunt felis tempus, hendrerit nulla. Nullam consequat purus ut justo condimentum, a cursus magna scelerisque. Nunc congue lacus viverra porta auctor. Aenean condimentum venenatis velit non commodo. Donec non nunc lacinia, sagittis orci ut, suscipit urna. Aenean ex quam, pellentesque sit amet turpis vitae, auctor tincidunt ligula. Etiam cursus, velit in pulvinar vestibulum, lacus velit sodales justo, ac porttitor urna lorem at ipsum. Vivamus massa nibh, elementum ornare neque et, sollicitudin laoreet eros. Sed volutpat ante."}
  />

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
