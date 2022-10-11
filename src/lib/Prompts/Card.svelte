<script>
  export let text = "";
  export let agreed = 0;
  export let showAgreeButton = false;
</script>

<container>
  <card>
    <h5>
      {#if agreed === 0}
        One person agrees
      {:else}
        {agreed + 1} People Agree
      {/if}
      <!-- OLD CODE
      {#if agreed === 0}
        No One Agrees
      {:else if agreed === 1}
        {agreed} Person Agrees
      {:else}
        {agreed} People Agree
      {/if}
      -->
    </h5>
    <hr />
    <p>{text}</p>

    {#if showAgreeButton}
      <button on:click>Agree</button>
    {/if}
  </card>
</container>

<style>
  container {
    width: 80%;
    min-height: 20vh;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;

    margin-left: auto;
    margin-right: auto;

    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
  }

  card {
    background-color: #222;

    width: 250px;
    min-height: 250px;

    display: -webkit-box;
    display: -ms-flexbox;

    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;

    padding: 20px;
    margin: 10px;

    -webkit-box-shadow: -20px -20px 0px 0px lighten(#121212, 10%);
    box-shadow: -20px -20px 0px 0px lighten(#121212, 10%);
    border-radius: 10px;

    -webkit-transition-timing-function: cubic-bezier(0.795, 0, 0.165, 1);
    -o-transition-timing-function: cubic-bezier(0.795, 0, 0.165, 1);
    transition-timing-function: cubic-bezier(0.795, 0, 0.165, 1);
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    margin: 0px;
    padding: 0px 0px 15px 0px;
    font-family: "Noto Sans KR", sans-serif;
    font-size: 20px;
    color: #ddd;
  }

  hr {
    display: block;
    border: none;
    height: 3px;
    background-color: #bbb;
    margin: 0px;

    -webkit-animation-name: line-show; /* Safari 4.0 - 8.0 */
    -webkit-animation-duration: 0.3s; /* Safari 4.0 - 8.0 */
    animation-name: line-show;
    animation-duration: 0.3s;
    -webkit-transition-timing-function: cubic-bezier(0.795, 0, 0.165, 1);
    -o-transition-timing-function: cubic-bezier(0.795, 0, 0.165, 1);
    transition-timing-function: cubic-bezier(0.795, 0, 0.165, 1); /* custom */
  }

  p {
    margin: 15px 0px 0px 0px;
    font-family: "Noto Sans KR", sans-serif;
    font-weight: 100;
    letter-spacing: -0.25px;
    line-height: 1.25;
    font-size: 16px;
    word-break: break-all;
    word-wrap: normal;
    color: white;

    -webkit-animation-name: p-show; /* Safari 4.0 - 8.0 */
    -webkit-animation-duration: 1.5s; /* Safari 4.0 - 8.0 */
    animation-name: p-show;
    animation-duration: 1.5s;
  }

  button {
    border: none;
    background-color: #121212;
    width: 50%;
    margin: 10px auto;
    padding: 10px 30px;
    color: white;
    font-family: "Noto Sans KR", sans-serif;
    text-transform: uppercase;
  }

  /* Safari 4.0 - 8.0 */
  @-webkit-keyframes line-show {
    from {
      margin: 0px 100px;
    }
    to {
      margin: 0px;
    }
  }

  /* Standard syntax */
  @keyframes line-show {
    from {
      margin: 0px 100px;
    }
    to {
      margin: 0px;
    }
  }

  /* Safari 4.0 - 8.0 */
  @-webkit-keyframes p-show {
    from {
      color: #222;
    }
    to {
      color: white;
    }
  }

  /* Standard syntax */
  @keyframes p-show {
    from {
      color: #222;
    }
    to {
      color: white;
    }
  }

  /* Safari 4.0 - 8.0 */
  @-webkit-keyframes shadow-show {
    from {
      -webkit-box-shadow: 0px 0px 0px 0px #e0e0e0;
      box-shadow: 0px 0px 0px 0px #e0e0e0;
    }
    to {
      -webkit-box-shadow: lighten(#121212, 10%);
      box-shadow: lighten(#121212, 10%);
    }
  }

  /* Standard syntax */
  @keyframes shadow-show {
    from {
      -webkit-box-shadow: 0px 0px 0px 0px #e0e0e0;
      box-shadow: 0px 0px 0px 0px #e0e0e0;
    }
    to {
      -webkit-box-shadow: lighten(#121212, 10%);
      box-shadow: lighten(#121212, 10%);
    }
  }
</style>
