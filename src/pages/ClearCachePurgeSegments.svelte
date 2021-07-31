<script>
  import {ConfigStore} from '@/store.js';
  import Status, {STATUS} from '@/components/Status.svelte';

  // Regexp from https://webapps.stackexchange.com/a/101153
  const YT_VIDEOID_REGEXP = new RegExp('^[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]$');
  let videoID = '';
  let videoIDValid = false;
  let status = STATUS.IDLE;

  function validateVideoID() {
    let result = false;
    let str = videoID;
    if (str.includes('http')) {
      const url = new URL(str);
      if (url.searchParams.has('v')) {
        str = url.searchParams.get('v');
      }
      if (url.host === 'youtu.be') {
        str = url.pathname.substring(1);
      }
      if (url.host === 'sb.ltn.fi') {
        if (url.pathname.includes('/video/')) {
          const folders = url.pathname.split('/');
          const videoIndex = folders.indexOf('video');
          const videoIdIndex = videoIndex + 1;
          if (videoIndex !== -1 && folders.length - 1 >= videoIdIndex) {
            str = folders[videoIdIndex];
          }
        } else {
          if (url.searchParams.has('videoid')) {
            str = url.searchParams.get('videoid');
          }
        }
      }
    }
    if (YT_VIDEOID_REGEXP.test(str)) {
      result = true;
      videoID = str;
    }
    videoIDValid = result;
  }

  async function doClearCache(lock = true) {
    status = STATUS.WORKING;
    const postData = new URLSearchParams();
    postData.set('videoID', videoID);
    postData.set('userID', $ConfigStore.privateUUID);
    const result = await fetch(
      `${$ConfigStore.sponsorBlockApi}/api/clearCache?${postData}`,
      {
        method: 'POST',
      }
    ).then(function (response) {
      return response.status;
    });
    if (result === 200) {
      status = STATUS.SUCCESS;
      videoID = '';
    }
    if (result === 400) {
      status = STATUS.ERROR_INVALID;
    }
    if (result === 403) {
      status = STATUS.ERROR_UNAUTHORIZED;
    }
  }

  async function doPurgeSegments() {
    status = STATUS.WORKING;
    const postData = new URLSearchParams();
    postData.set('videoID', videoID);
    postData.set('userID', $ConfigStore.privateUUID);
    const result = await fetch(
      `${$ConfigStore.sponsorBlockApi}/api/purgeAllSegments?${postData}`,
      {
        method: 'POST',
      }
    ).then(function (response) {
      return response.status;
    });
    if (result === 200) {
      status = STATUS.SUCCESS;
      videoID = '';
    }
    if (result === 400) {
      status = STATUS.ERROR_INVALID;
    }
    if (result === 403) {
      status = STATUS.ERROR_UNAUTHORIZED;
    }
  }
</script>

<main>
  <div class="container">
    <p class="viprequired">Only users with VIP status can do this!</p>
    <fieldset>
      <legend>Clear cache / Purge all segments</legend>
      <div class="form" class:working={status === STATUS.WORKING}>
        <div>
          <label for="videoid">VideoID:</label><br />
          <input
            id="videoid"
            type="text"
            bind:value={videoID}
            on:input={validateVideoID}
            placeholder="VideoID or URL..." />
        </div>

        <div class="actions">
          <button
            on:click={(_) => doClearCache()}
            disabled={!videoIDValid || status === STATUS.WORKING}>Clear cache</button>
          <button
            on:click={(_) => doPurgeSegments()}
            disabled={!videoIDValid || status === STATUS.WORKING}>Purge all
            segments</button>
        </div>
      </div>
    </fieldset>

    <Status {status} />
  </div>
</main>

<style>
  .form {
    position: relative;
  }
  .working:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.3);
  }
</style>
