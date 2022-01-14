<script>
  import {categoryList, categoryTitles, actionTypeList, actionTypeTitles} from '@/config.js';
  import {ConfigStore} from '@/store.js';
  import Status, {STATUS} from '@/components/Status.svelte';
  import VideoInput from '@/components/VideoInput.svelte';

  const defaultChecked = [...categoryList.filter((e) => !['poi_highlight', 'filler', 'exclusive_access'].includes(e))];

  let categories = [];
  let actionTypes = [...actionTypeList];
  let videoID = '';
  let status = STATUS.IDLE;
  let reason = '';

  async function doAction(lock = true) {
    status = STATUS.WORKING;
    const postData = {};
    postData.videoID = videoID;
    postData.userID = $ConfigStore.privateUUID;
    postData.reason = reason;
    postData.categories = categories;
    postData.actionTypes = actionTypes;
    const result = await fetch(
      `${$ConfigStore.sponsorBlockApi}/api/lockCategories`,
      {
        method: lock ? 'post' : 'delete',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      }
    ).then(function (response) {
      return response.status;
    });
    if (result === 200) {
      status = STATUS.SUCCESS;
      videoID = '';
      reason = '';
      categories = [];
      actionTypes = [...actionTypeList];
    }
    if (result === 400) {
      status = STATUS.ERROR_INVALID;
    }
    if (result === 403) {
      status = STATUS.ERROR_UNAUTHORIZED;
    }
  }

  function toggleCheckboxes() {
    if (categories.length === 0) {
      categories = [...defaultChecked];
    } else {
      categories = [];
    }
  }
</script>

<main>
  <div class="container">
    <p class="viprequired">Only users with VIP status can do this!</p>
    <fieldset>
      <legend>Lock categories</legend>
      <div class="form" class:working={status === STATUS.WORKING}>
        <div>
          <label for="videoid">VideoID:</label><br />
          <VideoInput
            id="videoid"
            bind:value={videoID}
          />
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
                for={'category_' + categoryId}>{categoryTitles[index]}</label>
            </div>
          {/each}
          <div>Action Types:</div>
          {#each actionTypeList as actionTypeId, index}
            <div class="actionType-option">
              <input
                id={'actionType_' + actionTypeId}
                type="checkbox"
                bind:group={actionTypes}
                value={actionTypeId} />
              <label
                for={'actionType_' + actionTypeId}>{actionTypeTitles[index]}</label>
            </div>
          {/each}
        </div>
        <div>
          <label for="reason">Lock Reason:</label><br />
          <textarea
            id="reason"
            cols="80"
            rows="3"
            bind:value={reason}
            placeholder="Reason..."></textarea>
        </div>

        <div class="actions">
          <button on:click={toggleCheckboxes}>Check all</button>
          <button
            on:click={_ => doAction(false)}
            disabled={videoID.length === 0 || categories.length === 0 || status === STATUS.WORKING}>Unlock</button>
          <button
            on:click={_ => doAction(true)}
            disabled={videoID.length === 0 || categories.length === 0 || status === STATUS.WORKING}>Lock</button>
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
