<script>
  import {ConfigStore} from '@/store.js';
  import { onMount } from 'svelte';
  import Status, {STATUS} from '@/components/Status.svelte';

  let userID = '';
  let userInfo = {};
  let status = STATUS.IDLE;

  const fields = [
    {
      title: 'Public User ID',
      key: 'userID'
    },
    {
      title: 'Username',
      key: 'userName'
    },
    {
      title: 'Minutes saved',
      key: 'minutesSaved'
    },
    {
      title: 'Segment count',
      key: 'segmentCount'
    },
    {
      title: 'ignoredSegmentCount',
      key: 'ignoredSegmentCount'
    },
    {
      title: 'viewCount',
      key: 'viewCount'
    },
    {
      title: 'ignoredViewCount',
      key: 'ignoredViewCount'
    },
    {
      title: 'warnings',
      key: 'warnings'
    },
    {
      title: 'warningReason',
      key: 'warningReason'
    },
    {
      title: 'reputation',
      key: 'reputation'
    },
    {
      title: 'vip',
      key: 'vip'
    },
    {
      title: 'lastSegmentID',
      key: 'lastSegmentID'
    },
  ];

  onMount(async () => {
    const url = new URL(window.location);
    if (url.searchParams.has('publicUserID')) {
      userID = url.searchParams.get('publicUserID');
      await fetchData();
    }
  });

  async function handleClick() {
    const url = new URL(window.location);
    url.searchParams.set('publicUserID', userID);
    window.history.pushState({}, '', url);
    await fetchData();
  }

  async function fetchData() {
    status = STATUS.WORKING;
    const result = await fetch(`${$ConfigStore.sponsorBlockApi}/api/userInfo?publicUserID=${userID}`, {
      method: 'get',
    }).then(async function (response) {
      return await response.json();
    });
    status = STATUS.SUCCESS;
    userInfo = result;
  }
</script>

<main>
  <div class="container">
    <fieldset>
      <legend>User Info:</legend>
      <div class="form" class:working={status === STATUS.WORKING}>
        <div>
          <label for="userid">Public UserID:</label><br />
          <input
            id="userid"
            type="text"
            bind:value={userID}
            size="64"
            placeholder="Public UserID..." />
            <button on:click={handleClick}>View</button>
        </div>
      </div>
    </fieldset>

    {#if userInfo?.warnings > 0}
      <div class="warning">
        <b>This UserID has {userInfo.warnings} active {userInfo.warnings === 1 ? 'warning':'warnings'}!</b>
        <blockquote>{userInfo.warningReason}</blockquote>
      </div>
    {/if}

    <div>
      <table>
        <tbody>
          {#each fields as field}
            <tr>
              <th>{field.title}</th>
              <td>{userInfo[field.key]}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

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
  .warning {
    margin: 16px;
    padding: 8px;
    border: 2px solid red;
  }
  .warning blockquote {
    font-style: italic;
    white-space: pre-line;
  }
  table {
    width: 100%;
    margin-top: 16px;
  }
  table th {
    text-align: left;
  }
  table th,
  table td {
    padding: 4px 6px;
  }
  tbody tr:nth-child(odd) {
    background: #2c2c2c;
  }
</style>
