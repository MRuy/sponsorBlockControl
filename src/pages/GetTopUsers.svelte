<script>
  import {onMount} from 'svelte';
  import {ConfigStore, CacheStore} from '../store.js';
  import Status, {STATUS} from '../components/Status.svelte';
  import {minutesReadable} from '../utils.js';

  const CACHE_TIME = 600000; // 10 minutes

  let status = STATUS.IDLE;
  let topUsers;
  let sortType = 0;

  async function getTopUsers() {
    status = STATUS.WORKING;
    const result = await fetch(
      `${$ConfigStore.sponsorBlockApi}/api/getTopUsers?sortType=${sortType}`
    ).then((response) => {
      return response.json();
    });
    status = STATUS.SUCCESS;
    return result.userNames.map((username, index) => {
      return {
        username,
        viewCount: result.viewCounts[index],
        totalSubmissions: result.totalSubmissions[index],
        minutesSaved: result.minutesSaved[index],
      };
    });
  }

  async function refresh() {
    topUsers = await getTopUsers();
    $CacheStore.topusers = topUsers;
    $CacheStore.topusers_time = Date.now();
  }

  onMount(async (_) => {
    if (
      'topusers' in $CacheStore &&
      $CacheStore.topusers_time + CACHE_TIME > Date.now()
    ) {
      topUsers = $CacheStore.topusers;
    } else {
      await refresh();
    }
  });
</script>

<main>
  <div class="container">
    {#if topUsers}
      <table>
        <thead>
          <tr>
            <th class="celltype-number">Rank</th>
            <th class="celltype-text">User Name</th>
            <th class="celltype-number">Submissions</th>
            <th class="celltype-number">Time Saved</th>
            <th class="celltype-number">Total Skips</th>
          </tr>
        </thead>
        <tbody>
          {#each topUsers as user, index}
            <tr class:row--even={index % 2 == 0}>
              <td class="celltype-number">{index + 1}</td>
              <td class="celltype-text">{user.username}</td>
              <td class="celltype-number">
                {user.totalSubmissions.toLocaleString()}
              </td>
              <td class="celltype-number">
                {minutesReadable(user.minutesSaved)}
              </td>
              <td class="celltype-number">{user.viewCount.toLocaleString()}</td>
            </tr>
          {/each}
        </tbody>
      </table>

      <div>
        <button
          on:click={(_) => {
            refresh();
          }}
          disabled={status === STATUS.WORKING}>Refresh</button>
      </div>
    {/if}

    <Status {status} />
  </div>
</main>

<style>
  .status {
    padding: 8px;
    margin: 8px;
    border: 1px dotted #ccc;
  }

  .celltype-number {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  table {
    margin: 0 2rem;
    border-collapse: collapse;
  }

  table thead {
    white-space: nowrap;
    text-align: left;
  }

  table td,
  table th {
    padding: 5px;
  }

  .row--even td {
    background-color: rgba(255, 255, 255, 0.02);
  }
</style>
