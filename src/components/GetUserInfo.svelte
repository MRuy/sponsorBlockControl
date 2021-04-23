<script>
  import {onMount} from 'svelte';
  import {ConfigStore, CacheStore} from '@/store.js';
  import {STATUS} from '@/components/Status.svelte';
  import {minutesReadable} from '@/utils.js';

  export let privateUUID = '';

  let status = STATUS.IDLE;
  let minutesSaved = 0;
  let viewCount = 0;
  let vip = false;
  let segmentCount = 0;
  let warnings = 0;
  let userName = 0;
  let userID = '';

  const CACHE_TIME = 600000; // 10 minutes

  async function doAction() {
    if (privateUUID === '') {
      status = STATUS.PRIVATEUUID_MISSING;
      return;
    }
    status = STATUS.WORKING;
    let userInfo = {};
    let useCache =
      'userInfo_time' in $CacheStore &&
      $CacheStore.userInfo_time + CACHE_TIME > Date.now();
    if (useCache) {
      userInfo = $CacheStore.userInfo;
    } else {
      const result = await fetch(
        `${$ConfigStore.sponsorBlockApi}/api/getUserInfo?userID=${privateUUID}`
      ).then((response) => {
        return response.json();
      });
      $CacheStore.userInfo_time = Date.now();
      userInfo = {
        minutesSaved: result.minutesSaved,
        viewCount: result.viewCount,
        vip: result.vip,
        segmentCount: result.segmentCount,
        warnings: result.warnings,
        userName: result.userName,
        userID: result.userID,
      };
      $CacheStore.userInfo = userInfo;
    }
    viewCount = userInfo.viewCount;
    minutesSaved = userInfo.minutesSaved;
    vip = userInfo.vip;
    segmentCount = userInfo.segmentCount;
    warnings = userInfo.warnings;
    userName = userInfo.userName;
    userID = userInfo.userID;
    status = STATUS.SUCCESS;
  }

  onMount(doAction);
</script>

<span>
  {#if status == STATUS.SUCCESS}
    Hello {#if vip === true}[VIP]{/if} {userName}<br>
    You have saved people from {viewCount.toLocaleString()} segments.<br>
    You have saved people {minutesReadable(minutesSaved, true)} of their lives.<br>
    You submitted {segmentCount.toLocaleString()} segments!<br>
    There is currently <b class:hasWarnings={warnings > 0}>{warnings}</b> warnings for your UserID ({userID})
  {/if}
  {#if status == STATUS.WORKING}Loading...{/if}
  {#if status == STATUS.PRIVATEUUID_MISSING}(Private UUID required){/if}
</span>

<style>
.hasWarnings {
  color: #f60c02;
}
</style>
