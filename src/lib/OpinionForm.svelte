<script>
  import OpinionCards from "./Prompts/OpinionCards.svelte";

  import Typewriter from "svelte-typewriter";
  import { fade } from "svelte/transition";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let writtenOpinion = "";

  export let opinions = [];

  export let choiceText = "";
  export let choiceIndex;
</script>

<wrap>
  <p>You chose: {choiceText}</p>
  <Typewriter>
    <h3>Why did you choose this?</h3>
    <p>Others will see this, so try to be convincing!</p>
  </Typewriter>

  <textarea bind:value={writtenOpinion} type="text" maxlength={500} />
  <button
    on:click={dispatch("opinion:submitted", {
      choice: choiceText,
      opinion: writtenOpinion,
    })}
    transition:fade={{ delay: 0, duration: 1000 }}>Submit</button
  >

  <p>Or agree with another opinion!</p>

  <OpinionCards
    {opinions}
    showAgreeButton={true}
    on:opinion:agreed={(e) => {
      console.log(e);
      dispatch("opinion:agreed", {
        opinion: e.detail.opinion,
        choiceText: choiceText,
        choiceIndex: choiceIndex,
      });
    }}
  />
</wrap>

<style>
  textarea {
    width: 75vw;
    height: 25vh;
    resize: none;
  }

  button {
    position: relative;

    cursor: pointer;
  }
</style>
