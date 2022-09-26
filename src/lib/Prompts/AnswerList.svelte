<script>
  import Answer from "./Answer.svelte";

  import { fade } from "svelte/transition";

  export let selected = -1;
  export let answers;
</script>

<wrapper>
  {#each answers as text, index}
    <div transition:fade={{ delay: index * 1250, duration: 1000 }}>
      {#if index > 0}
        <p>-</p>
      {/if}
      <Answer
        {text}
        {index}
        selected={selected === index}
        on:answer:selected={(e) => {
          selected = e.detail.index;
        }}
      />
    </div>
  {/each}
</wrapper>
