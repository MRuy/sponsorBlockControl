<script>
  import {onMount} from 'svelte';
  import {ConfigStore, CacheStore} from '../store.js';
  import {STATUS} from '../components/Status.svelte';
  import {minutesReadable} from '../utils.js';

  export let privateUUID = '';

  let status = STATUS.IDLE;
  let timeSaved;
  const CACHE_TIME = 600000; // 10 minutes

  async function doAction() {
    if (privateUUID === '') {
      status = STATUS.PRIVATEUUID_MISSING;
      return;
    }
    status = STATUS.WORKING;
    let useCache =
      'savedtimeforuser' in $CacheStore &&
      $CacheStore.savedtimeforuser_time + CACHE_TIME > Date.now();
    if (useCache) {
      timeSaved = $CacheStore.savedtimeforuser;
    } else {
      const result = await fetch(
        `${$ConfigStore.sponsorBlockApi}/api/getSavedTimeForUser?userID=${privateUUID}`
      ).then((response) => {
        return response.json();
      });
      $CacheStore.savedtimeforuser_time = Date.now();
      $CacheStore.savedtimeforuser = result.timeSaved;
      timeSaved = result.timeSaved;
    }
    status = STATUS.SUCCESS;
  }

  onMount(doAction);
</script>

<span>
  {#if status == STATUS.SUCCESS}
    You have saved people {minutesReadable(timeSaved, true)} of their lives.
  {/if}
  {#if status == STATUS.WORKING}Loading...{/if}
  {#if status == STATUS.PRIVATEUUID_MISSING}(Private UUID required){/if}
</span>
