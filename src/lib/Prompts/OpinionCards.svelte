<script>
  import OpinionCard from "./OpinionCard.svelte";

  import { fade } from "svelte/transition";

  export let opinions;
</script>

<wrapper>
  {#if opinions === null}
    <p transition:fade={{ duration: 1000 }}>
      <i>Select an choice to opinions for that choice.</i>
    </p>
  {:else if opinions.length > 0}
    <scroller>
      {#each opinions as opinion, index}
        <OpinionCard {opinion} {index} />
      {/each}
    </scroller>
  {:else}
    <p transition:fade={{ duration: 1000 }}>
      <i>No opinions exist yet for this choice.</i>
    </p>
  {/if}
</wrapper>

<style>
  wrapper {
    position: absolute;
    width: 100%;

    bottom: 20vh;
    left: 0;

    text-align: center;
  }

  scroller {
    margin: auto;

    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
  }
</style>
