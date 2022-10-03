<script>
  export let text;
  export let index;
  export let isSelected;

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  const clicked = () => {
    dispatch("choice:selected", {
      index: index,
      text: text,
    });
  };
</script>

<wrapper class:isSelected on:mousedown={clicked}>
  <p>{text}</p>
</wrapper>

<style>
  p:hover {
    cursor: pointer;
  }

  .isSelected {
    font-size: 1em;
    color: #a00;
  }
</style>
