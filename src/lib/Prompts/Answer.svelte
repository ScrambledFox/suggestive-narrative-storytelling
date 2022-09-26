<script>
  export let text;
  export let index;
  export let selected;

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  const clicked = () => {
    dispatch("answer:selected", {
      index: index,
      text: text,
    });
  };
</script>

<wrapper class:selected on:mousedown={clicked}>
  <p>{text}</p>
</wrapper>

<style>
  p {
    transition: 0.5s;
  }

  .selected {
    font-size: 1em;
    color: #a00;
  }
</style>
