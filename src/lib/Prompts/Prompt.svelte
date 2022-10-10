<script>
  import ChoiceList from "./ChoiceList.svelte";
  import OpinionCards from "./OpinionCards.svelte";

  import Typewriter from "svelte-typewriter";

  import { fade } from "svelte/transition";
  import Intro from "./Intro.svelte";

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let text;
  export let choices;
  export let choiceData;
  export let totalChosen;

  export let opinions = [];
  export let canHaveOpinion;

  export let showChoicePercentages = false;

  let showChoices = false;

  let selected = -1;
</script>

<wrapper>
  <Typewriter
    mode="concurrent"
    interval="20"
    on:done={() => {
      showChoices = true;
    }}
  >
    <h3>{text}</h3>
  </Typewriter>

  {#if showChoices}
    <ChoiceList
      {choices}
      {choiceData}
      {totalChosen}
      {showChoicePercentages}
      bind:selected
    />

    {#if canHaveOpinion}
      <OpinionCards
        opinions={selected >= 0
          ? opinions.filter((o) => {
              return o.choiceId === selected;
            })
          : null}
      />
    {/if}

    {#if selected !== -1}
      <button
        in:fade={{ delay: 0, duration: 1000 }}
        on:click={dispatch("choice:confirmed", {
          index: selected,
          choice: choices[selected],
        })}>Choose ▶</button
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
    bottom: 25px;

    cursor: pointer;
  }
</style>
