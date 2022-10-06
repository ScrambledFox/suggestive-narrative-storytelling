<script>
  import OpinionCard from "./OpinionCard.svelte";

  import { fade } from "svelte/transition";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let opinions = [];
  export let showAgreeButton = false;
</script>

<wrapper>
  <p in:fade={{ duration: 1000 }}>
    <i>Select a choice to see opinions for that choice.</i>
  </p>
  {#if opinions === null}
    <!--
    Dit werkte niet, het werd niet weergegeven als je nog geen selectie had gemaakt

    <p in:fade={{ duration: 1000 }}>
      <i>Select a choice to see opinions for that choice.</i>
    </p>
    -->
  {:else if opinions.length === 0}
    <p in:fade={{ duration: 1000 }}>
      <i>No opinions exist yet for this choice.</i>
    </p>
  {:else}
    <scroller>
      {#each opinions as opinion, index}
        <OpinionCard
          {opinion}
          agreed={opinion.agreedTimes}
          {showAgreeButton}
          on:opinion:agreed={(e) => {
            dispatch("opinion:agreed", {
              opinion: e.detail.opinion,
            });
          }}
        />
      {/each}
    </scroller>
  {/if}
</wrapper>

<style>
  wrapper {
    position: absolute;
    overflow: visible;

    width: 100vw;

    left: 0;

    text-align: left;
  }

  p {
    text-align: center;
  }

  scroller {
    margin: auto;

    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
  }
</style>
