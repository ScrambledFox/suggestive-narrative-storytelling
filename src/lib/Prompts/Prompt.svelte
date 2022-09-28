<script>
  import Question from "./Question.svelte";
  import AnswerList from "./AnswerList.svelte";
  import OpinionCards from "./OpinionCards.svelte";

  import Typewriter from "svelte-typewriter";

  import { fade } from "svelte/transition";
  import Intro from "./Intro.svelte";

  export let prompt;
  export let opinions;

  let answersVisible = false;

  let selected = -1;
</script>

<wrapper>
  {#if prompt.intro !== ""}
    <Intro text={prompt.intro} />
  {:else}
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
        <OpinionCards
          opinions={selected >= 0
            ? opinions.filter((o) => {
                return o.answer === selected;
              })
            : null}
        />
      {/if}
    {/if}

    {#if selected !== -1}
      <button transition:fade={{ delay: 0, duration: 1000 }}>Choose ▶</button>
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
    bottom: 40px;

    cursor: pointer;
  }
</style>
