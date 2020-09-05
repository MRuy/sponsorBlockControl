<script>
  export let items = [];
  export let clickHandler;
  export let selected;
</script>

<nav>
  {#each items as item, index}
    <button
      type="button"
      class:active={selected === item.component}
      on:click={(_) => {
        clickHandler(item.name);
      }}>
      {item.name}
    </button>
  {/each}
</nav>

<style>
  nav {
    margin-bottom: 16px;
  }

  nav button {
    background: none;
    box-sizing: border-box;
    margin: 3px;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    user-select: none;
    border: 1px solid transparent;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: 0.25rem;
    color: #ced4da;
    background-color: #6c757d;
    border-color: #6c757d;
    cursor: pointer;
  }
  nav button.active {
    color: #000;
    background-color: #f60c01;
    border-color: #f60c01;
  }
</style>
