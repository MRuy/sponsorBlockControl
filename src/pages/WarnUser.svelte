<script>
  import {ConfigStore} from '@/store.js';
  import {isValidUserUUID} from '@/utils.js';
  import Status, {STATUS} from '@/components/Status.svelte';

  let userUUID = '';
  let userUUIDValid = false;
  let status = STATUS.IDLE;

  async function doAction(action = 'warn') {
    status = STATUS.WORKING;
    const postData = new URLSearchParams();
    postData.set('issuerUserID', $ConfigStore.privateUUID);
    postData.set('userID', userUUID);
    postData.set('enabled', (action === 'warn').toString());
    const result = await fetch(`${$ConfigStore.sponsorBlockApi}/api/warnUser`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    }).then(function (response) {
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
  }
</script>

<main>
  <div class="container">
    <p class="viprequired">Only users with VIP status can do this!</p>
    <fieldset>
      <legend>Warn user:</legend>
      <div class="form" class:working={status === STATUS.WORKING}>
        <div>
          <label for="uuid">User UUID:</label><br />
          <input
            id="uuid"
            type="text"
            bind:value={userUUID}
            size="64"
            on:input={(_) => {
              userUUIDValid = isValidUserUUID(userUUID);
            }}
            placeholder="Users UUID..." />
        </div>

        <div class="actions">
          <button
            type="button"
            disabled={!userUUIDValid}
            on:click={(_) => {
              doAction('unwarn');
            }}>Unwarn</button>
          <button
            type="button"
            disabled={!userUUIDValid}
            on:click={(_) => {
              doAction('warn');
            }}>Warn</button>
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
