<script>
  import Footer from "./lib/Footer.svelte";

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
    <h1>Nothing to see here yet!</h1>
    <p>Please come back when there is some content.</p>
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
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
