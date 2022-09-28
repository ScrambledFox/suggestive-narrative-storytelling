<script>
  import Answer from "./Choice.svelte";

  import { fade } from "svelte/transition";

  export let selected = -1;
  export let choices;
</script>

<wrapper>
  {#each choices as choice, index}
    <div in:fade={{ delay: index * 1250, duration: 1000 }}>
      {#if index > 0}
        <p>-</p>
      {/if}
      <Answer
        text={choice.text}
        {index}
        selected={selected === index}
        on:choice:selected={(e) => {
          selected = e.detail.index;
        }}
      />
    </div>
  {/each}
</wrapper>
