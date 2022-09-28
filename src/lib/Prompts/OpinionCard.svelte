<script>
  import Card from "./Card.svelte";

  export let opinion;
  export let index;
</script>

<Card text={opinion.text} {index} />
