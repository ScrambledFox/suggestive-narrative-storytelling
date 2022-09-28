<script>
  import Question from "./Question.svelte";
  import ChoiceList from "./ChoiceList.svelte";
  import OpinionCards from "./OpinionCards.svelte";

  import Typewriter from "svelte-typewriter";

  import { fade } from "svelte/transition";
  import Intro from "./Intro.svelte";

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let text;
  export let choices;

  let showChoices = false;

  let selected = -1;

  const handleChosenOption = () => {
    dispatch("choice:confirmed", {
      index: selected,
      choice: choices[selected],
    });
  };
</script>

<wrapper>
  <Typewriter
    mode="concurrent"
    on:done={() => {
      showChoices = true;
    }}
  >
    <Question {text} />
  </Typewriter>

  {#if showChoices}
    <ChoiceList {choices} bind:selected />

    <!-- {#if prompt.canHaveOpinion}
      <OpinionCards
        opinions={selected >= 0
          ? opinions.filter((o) => {
              return o.answer === selected;
            })
          : null}
      />
    {/if} -->

    {#if selected !== -1}
      <button
        transition:fade={{ delay: 0, duration: 1000 }}
        on:click={handleChosenOption}>Choose ▶</button
      >
    {/if}
  {/if}
</wrapper>

<style>
  wrapper {
    --cursor-color: white;
  }

  button {
    position: absolute;
    right: 25px;
    bottom: 75px;

    cursor: pointer;
  }
</style>
