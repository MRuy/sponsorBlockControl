<script>
  import {ConfigStore} from '@/store.js';
  import {isValidSegmentUUID} from '@/utils.js';
  import Status, {STATUS} from '@/components/Status.svelte';

  let status = STATUS.IDLE;
  let uuid = '';
  let uuidValid = false;

  async function doVote(segmentUUID, voteType = 0) {
    status = STATUS.WORKING;
    const postData = new URLSearchParams();
    postData.set('UUID', segmentUUID);
    postData.set('userID', $ConfigStore.privateUUID);
    postData.set('type', voteType);
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
      <legend>Vote on segment</legend>
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
      <div class="actions">
        <button
          on:click={(_) => {
            doVote(uuid, 0);
          }}
          disabled={status === STATUS.WORKING || !uuidValid || status === STATUS.WORKING}>Downvote</button>
        <button
          on:click={(_) => {
            doVote(uuid, 1);
          }}
          disabled={status === STATUS.WORKING || !uuidValid || status === STATUS.WORKING}>Upvote</button>
      </div>
    </fieldset>

    <Status {status} />
  </div>
</main>

<style>
</style>
