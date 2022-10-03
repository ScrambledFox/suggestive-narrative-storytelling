<script>
  import Answer from "./Choice.svelte";

  import { fade } from "svelte/transition";

  export let selected = -1;
  export let choices;
  export let choiceData;
  export let totalChosen;

  const getChosenPercentage = (index) => {
    let choice = choiceData.find((c) => c.index === index);
    if (choice === undefined) return 0;
    if (totalChosen === 0) return 0;
    return ((choice.chosen * 100) / totalChosen).toFixed(0);
  };

  console.log(choiceData, totalChosen);
</script>

<wrapper>
  {#each choices as choice, index}
    <div in:fade={{ delay: index * 1250, duration: 1000 }}>
      {#if index > 0}
        <p>-</p>
      {/if}
      <Answer
        text={choice.text + ` (${getChosenPercentage(index)}%)`}
        {index}
        isSelected={selected === index}
        on:choice:selected={(e) => {
          selected = e.detail.index;
        }}
      />
    </div>
  {/each}
</wrapper>
