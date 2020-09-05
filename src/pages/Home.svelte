<script>
  import {ConfigStore, CacheStore} from '../store.js';
  import GetSavedTimeForUser from '../components/GetSavedTimeForUser.svelte';
  import GetViewsForUser from '../components/GetViewsForUser.svelte';

  let privateUUID = $ConfigStore.privateUUID;
  let privateUUIDGotSaved = false;

  function savePrivateUUID(event) {
    if ($ConfigStore.privateUUID != privateUUID) {
      // reset the cache store
      $CacheStore = {};
    }
    $ConfigStore.privateUUID = privateUUID;
    privateUUIDGotSaved = true;
    setTimeout((_) => {
      privateUUIDGotSaved = false;
    }, 3000);
  }

  let sponsorBlockApi = $ConfigStore.sponsorBlockApi;
  let sponsorBlockApiGotSaved = false;

  function saveSponsorBlockApi(event) {
    $ConfigStore.sponsorBlockApi = sponsorBlockApi;
    sponsorBlockApiGotSaved = true;
    setTimeout((_) => {
      sponsorBlockApiGotSaved = false;
    }, 3000);
  }
</script>

<main>
  <div class="container">
    <details>
      <summary>
        Settings {#if $ConfigStore.privateUUID === ''}(Set your private UUID!){/if}
      </summary>
      <fieldset>
        <legend>Private userID:</legend>
        <div class="info">
          <p>
            Your private userID will only be stored in your Browser and only
            send to the SponsorBlock API.
          </p>
        </div>
        <div>
          <label for="privateUUID">Your private userID:</label><br />
          <input
            id="privateUUID"
            type="text"
            bind:value={privateUUID}
            size="36"
            pattern="^[A-Za-z0-9]{36}$"
            spellcheck="false"
            placeholder="Private UUID" />
          <div class="actions">
            <button
              on:click={savePrivateUUID}>{privateUUIDGotSaved ? 'Saved!' : 'Save'}</button>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>API Server:</legend>
        <div>
          <label for="serveraddr">SponsorBlock Server:</label><br />
          <input
            type="url"
            id="serveraddr"
            class="serveraddr"
            bind:value={sponsorBlockApi}
            placeholder="https://..." />
          <div class="actions">
            <button
              on:click={saveSponsorBlockApi}>{sponsorBlockApiGotSaved ? 'Saved!' : 'Save'}</button>
          </div>
        </div>
      </fieldset>
    </details>

    <p style="width:100%">
      <GetViewsForUser privateUUID={$ConfigStore.privateUUID} /><br />
      <GetSavedTimeForUser privateUUID={$ConfigStore.privateUUID} />
    </p>
  </div>
</main>

<style>
  .serveraddr {
    width: 100%;
  }
  fieldset {
    margin: 8px 0;
  }
  details > fieldset {
    margin: 16px;
  }
  summary {
    cursor: pointer;
  }

  #privateUUID {
    width: 100%;
  }
</style>
