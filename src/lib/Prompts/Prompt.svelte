<script>
  import Question from "./Question.svelte";
  import AnswerList from "./AnswerList.svelte";
  import OpinionCards from "./OpinionCards.svelte";

  import Typewriter from "svelte-typewriter";

  import { fade } from "svelte/transition";

  export let prompt;

  let answersVisible = false;

  let selected = -1;
</script>

<wrapper>
  <Typewriter
    mode="concurrent"
    on:done={() => {
      answersVisible = true;
    }}
  >
    <Question text={prompt.question} />
  </Typewriter>

  {#if answersVisible}
    <AnswerList answers={prompt.answers} bind:selected />

    {#if prompt.canHaveOpinion}
      <OpinionCards {selected} />
    {/if}
  {/if}

  {#if selected !== -1}
    <button transition:fade={{ delay: 0, duration: 1000 }}>Choose ▶</button>
  {/if}
</wrapper>

<style>
  wrapper {
    height: 100%;
  }

  button {
    position: absolute;
    right: 25px;
    bottom: 40px;
  }
</style>
