<script>
  import {ConfigStore} from '@/store.js';
  import {isValidSegmentUUID} from '@/utils.js';
  import {categoryList, categoryTitles} from '@/config.js';
  import Status, {STATUS} from '@/components/Status.svelte';

  let status = STATUS.IDLE;
  let uuid = '';
  let uuidValid = false;
  let selectedCategoryId = '';

  async function doVote() {
    status = STATUS.WORKING;
    const postData = new URLSearchParams();
    postData.set('UUID', uuid);
    postData.set('userID', $ConfigStore.privateUUID);
    postData.set('category', selectedCategoryId);
    const result = await fetch(
      `${$ConfigStore.sponsorBlockApi}/api/voteOnSponsorTime?${postData}`,
      {
        method: 'POST',
      }
    ).then((response) => {
      return response.status;
    });
    if (result === 200) {
      status = STATUS.SUCCESS;
      uuid = '';
      uuidValid = false;
      selectedCategoryId = '';
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
      <legend>Change segment category</legend>
      <div>
        <label for="uuid">Segment UUID:</label><br />
        <input
          id="uuid"
          type="text"
          size="64"
          bind:value={uuid}
          pattern="[a-f0-9]{'{64}'}"
          on:input={(_) => {
            uuidValid = isValidSegmentUUID(uuid);
          }}
          placeholder="Segment UUID ..."
          disabled={status === STATUS.WORKING} />
      </div>
      <div>
        <label for="category">Category:</label><br />
        <select id="category" bind:value={selectedCategoryId}>
          <option value="">--- Select category ---</option>
          {#each categoryList as categoryId, index}
            <option value={categoryId}>{categoryTitles[index]}</option>
          {/each}
        </select>
      </div>
      <div class="actions">
        <button
          on:click={(_) => {
            doVote();
          }}
          disabled={status === STATUS.WORKING || !uuidValid || status === STATUS.WORKING}>Change
          category</button>
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
