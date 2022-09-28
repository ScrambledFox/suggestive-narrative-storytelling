<script>
  import pkg from "../../package.json";
</script>

<footer>
  <p>
    <version>
      v{pkg.version}
    </version>
  </p>
</footer>

<style>
  footer {
    position: fixed;

    left: 0;
    bottom: 0;

    width: 100%;

    background-color: #222;
    color: white;
    text-align: center;
  }

  version {
    color: #888;
  }
</style>
