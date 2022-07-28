<script>
  import {ConfigStore} from '@/store.js';
  import {isValidUserUUID} from '@/utils.js';
  import {features} from '@/config.js';
  import Status, {STATUS} from '@/components/Status.svelte';

  let status = STATUS.IDLE;
  let userID = '';
  let userIDValid = false;
  let selectedFeature = -1;
  let enabled = true;

  $: {
    userIDValid = isValidUserUUID(userID);
  }

  async function addFeature() {
    status = STATUS.WORKING;
    const postData = {};
    postData.userID = userID;
    postData.adminUserID = $ConfigStore.privateUUID;
    postData.feature = selectedFeature;
    postData.enabled = enabled.toString();

    const result = await fetch(
      `${$ConfigStore.sponsorBlockApi}/api/feature`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      }
    ).then((response) => {
      return response.status;
    });
    if (result === 200) {
      status = STATUS.SUCCESS;
      userID = '';
      selectedFeature = 0;
      enabled = true;
    }
    if (result === 400) {
      status = STATUS.INVALID;
    }
    if (result === 405) {
      status = STATUS.DUPLICATE;
    }
  }
</script>

<main>
  <div class="container">
    <fieldset>
      <legend>Add user feature</legend>
      <div>
        <label for="userID">UserID:</label><br />
        <input
          id="userID"
          type="text"
          size="64"
          bind:value={userID}
          placeholder="Target UserID ..."
          disabled={status === STATUS.WORKING} />
      </div>
      <div>
        <label for="feature">Feature:</label><br />
        <select id="feature" bind:value={selectedFeature}>
          <option value={-1}>--- Select feature ---</option>
          {#each features as feature}
            <option value={feature.code}>{feature.name}</option>
          {/each}
        </select>
      </div>
      <div>
        <input
          id="enabled"
          type="checkbox"
          bind:checked={enabled} />
        <label for="enabled">Enabled</label>
      </div>
      <div class="actions">
        <button
          on:click={(_) => {
            addFeature();
          }}
          disabled={status === STATUS.WORKING || !userIDValid || status === STATUS.WORKING}>Add feature</button>
      </div>
    </fieldset>

    <Status {status} />
  </div>
</main>

<style>
  select {
    color: #dee2e6;
    border: 1px solid #6c757d;
    border-radius: .25rem;
    background-color: #000;
    padding: .175rem .5rem;
  }
</style>
