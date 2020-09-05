<script>
  import {onMount} from 'svelte';
  import {ConfigStore, CacheStore} from '../store.js';
  import {STATUS} from '../components/Status.svelte';
  import {minutesReadable} from '../utils.js';

  export let privateUUID = '';

  let status = STATUS.IDLE;
  let viewCount = 0;
  const CACHE_TIME = 600000; // 10 minutes

  async function doAction() {
    if (privateUUID === '') {
      status = STATUS.PRIVATEUUID_MISSING;
      return;
    }
    status = STATUS.WORKING;
    let useCache =
      'viewsforuser' in $CacheStore &&
      $CacheStore.viewsforuser_time + CACHE_TIME > Date.now();
    if (useCache) {
      viewCount = $CacheStore.viewsforuser;
    } else {
      const result = await fetch(
        `${$ConfigStore.sponsorBlockApi}/api/getViewsForUser?userID=${privateUUID}`
      ).then((response) => {
        return response.json();
      });
      $CacheStore.viewsforuser_time = Date.now();
      $CacheStore.viewsforuser = result.viewCount;
      viewCount = result.viewCount;
    }
    status = STATUS.SUCCESS;
  }

  onMount(doAction);
</script>

<span>
  {#if status == STATUS.SUCCESS}
    You have saved people from {viewCount.toLocaleString()} segments.
  {/if}
  {#if status == STATUS.WORKING}Loading...{/if}
  {#if status == STATUS.PRIVATEUUID_MISSING}(Private UUID required){/if}
</span>
