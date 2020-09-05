<script>
  import {onMount} from 'svelte';
  import {ConfigStore, CacheStore} from '../store.js';
  import Status, {STATUS} from '../components/Status.svelte';

  let userName = '';
  let targetUsername = '';
  let targetUUID = '';
  let status = STATUS.IDLE;
  const CACHE_TIME = 600000; // 10 minutes

  async function getUsername() {
    status = STATUS.WORKING;
    const response = await fetch(
      `${$ConfigStore.sponsorBlockApi}/api/getUsername?userID=${$ConfigStore.privateUUID}`
    );
    if (response.status === 200) {
      const resp = await response.json();
      status = STATUS.SUCCESS;
      return resp.userName;
    }
    if (response === 400) {
      status = STATUS.ERROR_INVALID;
    }
    if (response === 403) {
      status = STATUS.ERROR_UNAUTHORIZED;
    }
    return '';
  }

  async function setUsername(userID, userName, adminUserID) {
    status = STATUS.WORKING;
    const postData = new URLSearchParams();
    postData.set('userID', userID);
    postData.set('username', userName);
    if (adminUserID) {
      postData.set('adminUserID', adminUserID);
    }
    const response = await fetch(
      `${$ConfigStore.sponsorBlockApi}/api/setUsername?${postData}`,
      {
        method: 'POST',
      }
    );
    if (response.status === 200) {
      status = STATUS.SUCCESS;
    }
    if (response.status === 400) {
      status = STATUS.ERROR_INVALID;
    }
    if (response.status === 403) {
      status = STATUS.ERROR_UNAUTHORIZED;
    }
  }

  async function loadUsername() {
    userName = await getUsername();
    $CacheStore.username = userName;
    $CacheStore.username_time = Date.now();
  }

  onMount(async (_) => {
    if (
      'username' in $CacheStore &&
      $CacheStore.username_time + CACHE_TIME > Date.now()
    ) {
      userName = $CacheStore.username;
    } else {
      await loadUsername();
    }
  });
</script>

<main>
  <div class="container">
    <div class="form" class:working={status === STATUS.WORKING}>
      <fieldset>
        <legend>Your Username:</legend>
        <input type="text" bind:value={userName} placeholder="Username..." />
        <button
          on:click={async (_) => {
            await setUsername($ConfigStore.privateUUID, userName);
            await loadUsername();
          }}
          disabled={userName.length == 0}>Save</button>
      </fieldset>

      <fieldset>
        <legend>
          Change Username: <span class="viprequired">(VIP Required)</span>
        </legend>
        <input
          type="text"
          bind:value={targetUUID}
          placeholder="Target UUID..." />
        <input
          type="text"
          bind:value={targetUsername}
          placeholder="Username..." />
        <button
          on:click={(_) => {
            setUsername(targetUUID, targetUsername, $ConfigStore.privateUUID);
          }}
          disabled={targetUUID.length != 64 || targetUsername.length == 0}>Update</button>
      </fieldset>
    </div>

    <Status {status} />
  </div>
</main>

<style>
  .form {
    display: flex;
    gap: 16px;
    position: relative;
  }
  fieldset {
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
