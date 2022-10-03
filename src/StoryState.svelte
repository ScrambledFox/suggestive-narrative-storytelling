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
    {#if state.choices !== undefined && state.choices.length > 0}
      <Prompt
        text={state.prompt}
        choices={state.choices}
        choiceData={state.choiceData}
        totalChosen={state.totalChosen}
        canHaveOpinion={state.opinionId > 0}
        opinions={state.opinions}
        on:choice:confirmed={(e) => sendChoice(e)}
      />
    {:else}
      <Intro
        text={state.prompt}
        canContinue={state.choices !== undefined && state.choices.length === 0}
        on:story:continue={() => dispatch("story:continue")}
      />
    {/if}
  {/if}
</wrapper>

<style>
</style>
