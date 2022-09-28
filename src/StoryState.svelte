<script>
  import Intro from "./lib/Prompts/Intro.svelte";
  import Prompt from "./lib/Prompts/Prompt.svelte";

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let state = null;

  const sendChoice = (e) => {
    dispatch("choice:confirmed", {
      index: e.detail.index,
      choice: e.detail.choice,
    });
  };
</script>

<wrapper>
  {#if state !== null}
    {#if state.choices !== null && state.choices.length > 0}
      <Prompt
        text={state.prompt}
        choices={state.choices}
        on:choice:confirmed={(e) => sendChoice(e)}
      />
    {:else}
      <Intro
        text={state.prompt}
        canContinue={state !== null && state.choices.length === 0}
        on:story:continue={() => dispatch("story:continue")}
      />
    {/if}
  {:else}
    <Intro text="The end." />
  {/if}
</wrapper>

<style>
</style>
