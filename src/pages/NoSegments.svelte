<script>
  import {categoryList, categoryTiles} from '@/config.js';
  import {ConfigStore} from '@/store.js';
  import Status, {STATUS} from '@/components/Status.svelte';

  // Regexp from https://webapps.stackexchange.com/a/101153
  const YT_VIDEOID_REGEXP = new RegExp('^[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]$');
  let categories = [];
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
    }
    if (YT_VIDEOID_REGEXP.test(str)) {
      result = true;
      videoID = str;
    }
    videoIDValid = result;
  }

  async function doAction() {
    status = STATUS.WORKING;
    const postData = new FormData();
    postData.set('videoID', videoID);
    postData.set('userID', $ConfigStore.privateUUID);
    postData.set('categories', JSON.stringify(categories));
    const result = await fetch(
      `${$ConfigStore.sponsorBlockApi}/api/noSegments`,
      {
        method: 'post',
        body: postData,
      }
    ).then(function (response) {
      return response.status;
    });
    if (result === 200) {
      status = STATUS.SUCCESS;
      videoID = '';
      categories = [];
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
      <legend>No segments</legend>
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
        <div>
          <div>Categories:</div>
          {#each categoryList as categoryId, index}
            <div class="category-option">
              <input
                id={'category_' + categoryId}
                type="checkbox"
                bind:group={categories}
                value={categoryId} />
              <label
                for={'category_' + categoryId}>{categoryTiles[index]}</label>
            </div>
          {/each}
        </div>

        <div class="actions">
          <button
            on:click={doAction}
            disabled={!videoIDValid || categories.length === 0 || status === STATUS.WORKING}>Submit</button>
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
  .category-option {
    margin-left: 16px;
  }
</style>
