<script>
  import { createEventDispatcher } from "svelte/internal";
  import Card from "./Card.svelte";

  const dispatch = createEventDispatcher();

  export let opinion;
  export let agreed;
  export let showAgreeButton;

  const handleClick = () => {
    dispatch("opinion:agreed", {
      opinion: opinion,
    });
  };
</script>

<Card
  text={opinion.opinion}
  {agreed}
  {showAgreeButton}
  on:click={() => handleClick()}
/>
