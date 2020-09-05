<script context="module">
  export const STATUS = {
    IDLE: Symbol('idle'),
    WORKING: Symbol('working'),
    SUCCESS: Symbol('success'),
    NOT_FOUND: Symbol('error-404'),
    ERROR_INVALID: Symbol('error-invalid'),
    ERROR_UNAUTHORIZED: Symbol('error-unauthorized'),
    STATUS_DUPLICATE: Symbol('duplicate'),
    PRIVATEUUID_MISSING: Symbol('private-uuid-missing'),
  };
</script>

<script>
  export let status;
</script>

<div class="status">
  Status: {#if status == STATUS.IDLE}Ready!{/if}
  {#if status == STATUS.WORKING}
    <div class="lds-dual-ring" />
    Sending request...
  {/if}
  {#if status == STATUS.SUCCESS}Done. Success!{/if}
  {#if status == STATUS.ERROR_INVALID}
    <span class="error">Bad Request (Your inputs are wrong/impossible)</span>
  {/if}
  {#if status == STATUS.ERROR_UNAUTHORIZED}
    <span class="error">Error. You are not allowed to do that!</span>
  {/if}
  {#if status == STATUS.DUPLICATE}
    <span class="error">Error: Duplicate</span>
  {/if}
  {#if status == STATUS.NOT_FOUND}
    <span class="error">Error: Not found!</span>
  {/if}
  {#if status == STATUS.PRIVATEUUID_MISSING}(Private UUID required){/if}
</div>

<style>
  .error {
    color: red;
  }
  .lds-dual-ring {
    display: inline-block;
    vertical-align: middle;
    width: 1em;
    height: 1em;
  }
  .lds-dual-ring:after {
    content: ' ';
    display: block;
    width: 0.8em;
    height: 0.8em;
    margin: 0.1em;
    border-radius: 50%;
    border: 0.075em solid #fff;
    border-color: #fff transparent #fff transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }
  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
