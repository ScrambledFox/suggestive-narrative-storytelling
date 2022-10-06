<script>
  import Typewriter from "svelte-typewriter";

  import { fade } from "svelte/transition";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let text = "";
  export let canContinue = false;

  const handleContinue = () => {
    dispatch("story:continue");
  };
</script>

{#if text !== null}
  <Typewriter mode="cascade" interval=20 keepCursorOnFinish={true} on:done={() => {}}>
    <p>{text}</p>
  </Typewriter>
{/if}

{#if canContinue}
  <button in:fade={{ delay: 0, duration: 1000 }} on:click={handleContinue}
    >Continue ▶</button
  >
{/if}

<style>
  button {
    position: absolute;
    right: 25px;
    bottom: 25px;

    cursor: pointer;
  }
</style>
