<script>
  import {ConfigStore} from '@/store.js';
  import {isValidUserUUID} from '@/utils.js';
  import Status, {STATUS} from '@/components/Status.svelte';

  let userUUID = '';
  let channelVideoID = '';
  let userUUIDValid = false;
  let status = STATUS.IDLE;

  $: {
    userUUIDValid = isValidUserUUID(userUUID);
  }

  function addVIP() {
    doAction('add');
  }

  function removeVIP() {
    doAction('remove');
  }

  async function doAction(action = 'add') {
    status = STATUS.WORKING;
    const postData = new URLSearchParams();
    postData.set('adminUserID', $ConfigStore.privateUUID);
    postData.set('userID', userUUID);
    postData.set('channelVideoID', channelVideoID);
    postData.set('enabled', (action === 'add').toString());
    const result = await fetch(
      `${$ConfigStore.sponsorBlockApi}/api/AddUserAsTempVIP?${postData}`,
      {
        method: 'post',
      }
    ).then(function (response) {
      return response.status;
    });
    if (result === 200) {
      status = STATUS.SUCCESS;
    }
    if (result === 400) {
      status = STATUS.ERROR_INVALID;
    }
    if (result === 403) {
      status = STATUS.ERROR_UNAUTHORIZED;
    }
    if (result === 404) {
      status = STATUS.NOT_FOUND;
    }
    if (result === 409) {
      status = STATUS.DUPLICATE;
    }
  }
</script>

<main>
  <div class="container">
    <p class="viprequired">Only VIPs can do this!</p>
    <fieldset>
      <legend>Add/Remove Temporary Channel VIP</legend>
      <div class="form" class:working={status === STATUS.WORKING}>
        <div>
          <label for="uuid">User UUID:</label><br />
          <input
            id="uuid"
            type="text"
            bind:value={userUUID}
            size="64"
            placeholder="Users UUID..." />
          <br>
          <label for="videoID">VideoID from channel:</label><br />
          <input
            id="videoID"
            type="text"
            bind:value={channelVideoID}
            size="11"
            placeholder="VideoID" />
        </div>

        <div class="actions">
          <button on:click={removeVIP} disabled={!userUUIDValid}>Remove</button>
          <button on:click={addVIP} disabled={!userUUIDValid}>Add</button>
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
