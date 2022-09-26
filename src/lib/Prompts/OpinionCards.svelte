<script>
  import OpinionCard from "./OpinionCard.svelte";

  import { fade } from "svelte/transition";

  export let selected;
  export let opinions = [];
</script>

<wrapper>
  {#if selected !== -1}
    {#each opinions as opinion}
      <OpinionCard {opinion} />
    {/each}
  {:else}
    <p transition:fade={{ duration: 1000 }}>
      <i>Select an answer to opinions for that answer.</i>
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
</style>
