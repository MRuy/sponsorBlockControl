<script>
  import {categoryList, categoryTitles} from '@/config.js';
  import {ConfigStore} from '@/store.js';
  import {isValidUserUUID} from '@/utils.js';
  import Status, {STATUS} from '@/components/Status.svelte';

  let userUUID = '';
  let hideOldSubmissions = true;
  let categories = [...categoryList];
  let userUUIDValid = false;
  let status = STATUS.IDLE;

  $: {
    userUUIDValid = isValidUserUUID(userUUID);
  }

  async function doAction(action = 'ban') {
    status = STATUS.WORKING;
    const postData = new URLSearchParams();
    postData.set('adminUserID', $ConfigStore.privateUUID);
    postData.set('userID', userUUID);
    postData.set('enabled', (action === 'ban').toString());
    postData.set('unHideOldSubmissions', hideOldSubmissions.toString());
    postData.set('categories', JSON.stringify(categories));
    const result = await fetch(
      `${$ConfigStore.sponsorBlockApi}/api/shadowBanUser?${postData}`,
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
  }
</script>

<main>
  <div class="container">
    <p class="viprequired">Only users with VIP status can do this!</p>
    <fieldset>
      <legend>Shadow ban user:</legend>
      <div class="form" class:working={status === STATUS.WORKING}>
        <div>
          <label for="uuid">User UUID:</label><br />
          <input
            id="uuid"
            type="text"
            bind:value={userUUID}
            size="64"
            placeholder="Users UUID..." />
        </div>

        <div>
          <input
            id="hideoldsubmissions"
            type="checkbox"
            bind:checked={hideOldSubmissions} />
          <label for="hideoldsubmissions">Hide/Restore old submissions</label>
        </div>

        <div
          class="categories-to-hide"
          hidden={!hideOldSubmissions}
        >
          <div>Categories to hide:</div>
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
        </div>

        <div class="actions">
          <button
            type="button"
            disabled={!userUUIDValid}
            on:click={(_) => {
              doAction('unban');
            }}>Unban</button>
          <button
            type="button"
            disabled={!userUUIDValid}
            on:click={(_) => {
              doAction('ban');
            }}>Ban</button>
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
  .categories-to-hide {
    margin-left: 16px;
  }
  .category-option {
    margin-left: 16px;
  }
</style>
