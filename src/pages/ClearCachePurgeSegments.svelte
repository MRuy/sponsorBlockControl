<script>
  import {ConfigStore} from '@/store.js';
  import Status, {STATUS} from '@/components/Status.svelte';
  import VideoInput from '@/components/VideoInput.svelte';

  let videoID = '';
  let status = STATUS.IDLE;

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
    const postData = {};
    postData.videoID = videoID;
    postData.userID = $ConfigStore.privateUUID;
    const result = await fetch(
      `${$ConfigStore.sponsorBlockApi}/api/purgeAllSegments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData),
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
          <VideoInput
            id="videoid"
            bind:value={videoID}
          />
        </div>

        <div class="actions">
          <button
            on:click={(_) => doClearCache()}
            disabled={videoID.length === 0 || status === STATUS.WORKING}>Clear cache</button>
          <button
            on:click={(_) => doPurgeSegments()}
            disabled={videoID.length === 0 || status === STATUS.WORKING}>Purge all
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
