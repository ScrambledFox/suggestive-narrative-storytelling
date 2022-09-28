<script>
  import Typewriter from "svelte-typewriter";

  import { fade } from "svelte/transition";

  export let text;
</script>

<Typewriter mode="cascade" keepCursorOnFinish={true} on:done={() => {}}>
  <p>{text}</p>
</Typewriter>

<button transition:fade={{ delay: 0, duration: 1000 }}>Continue ▶</button>

<style>
  button {
    position: absolute;
    right: 25px;
    bottom: 40px;

    cursor: pointer;
  }
</style>
