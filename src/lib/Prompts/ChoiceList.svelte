<script>
  import Answer from "./Choice.svelte";

  import { fade } from "svelte/transition";

  export let selected = -1;
  export let choices;
  export let choiceData;
  export let totalChosen;
  export let showChoicePercentages = false;

  const getChosenPercentage = (index) => {
    let choice = choiceData.find((c) => c.index === index);
    if (choice === undefined)
      return `(0% of ${totalChosen} ${
        totalChosen === 1 ? "person" : "people"
      })`;
    if (totalChosen === 0)
      return `(0% of ${totalChosen} ${
        totalChosen === 1 ? "person" : "people"
      })`;
    return `(${((choice.chosen * 100) / totalChosen).toFixed(0)}% (${
      choice.chosen
    }) of ${totalChosen} ${totalChosen === 1 ? "person" : "people"})`;
  };
</script>

<wrapper>
  {#each choices as choice, index}
    <div in:fade={{ delay: index * 1250, duration: 1000 }}>
      {#if index > 0}
        <p>-</p>
      {/if}
      <Answer
        text={choice.text +
          (showChoicePercentages ? " " + getChosenPercentage(index) : "")}
        {index}
        isSelected={selected === index}
        on:choice:selected={(e) => {
          selected = e.detail.index;
        }}
      />
    </div>
  {/each}
</wrapper>
