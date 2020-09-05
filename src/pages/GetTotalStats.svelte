<script>
  import {onMount} from 'svelte';
  import {ConfigStore, CacheStore} from '../store.js';
  import Status, {STATUS} from '../components/Status.svelte';
  import {minutesReadable} from '../utils.js';

  const CACHE_TIME = 600000; // 10 minutes

  let status = STATUS.IDLE;
  let stats = {
    userCount: 0,
    viewCount: 0,
    totalSubmissions: 0,
    minutesSaved: 0,
  };

  async function getTotalStats() {
    status = STATUS.WORKING;
    const result = await fetch(
      `${$ConfigStore.sponsorBlockApi}/api/getTotalStats`
    ).then((response) => {
      return response.json();
    });
    status = STATUS.SUCCESS;
    return result;
  }

  async function refresh() {
    stats = await getTotalStats();
    $CacheStore.totalstats = stats;
    $CacheStore.totalstats_time = Date.now();
  }

  onMount(async (_) => {
    if (
      'totalstats' in $CacheStore &&
      $CacheStore.totalstats_time + CACHE_TIME > Date.now()
    ) {
      stats = $CacheStore.totalstats;
    } else {
      await refresh();
    }
  });
</script>

<main>
  <div class="container">
    {#if stats}
      <table class="stats-table">
        <tbody>
          <tr>
            <th>Contributing Users:</th>
            <td>{stats.userCount.toLocaleString()}</td>
          </tr>
          <tr>
            <th>Skip Count:</th>
            <td>{stats.viewCount.toLocaleString()} skips</td>
          </tr>
          <tr>
            <th>Submissions:</th>
            <td>{stats.totalSubmissions.toLocaleString()}</td>
          </tr>
          <tr>
            <th>Time Saved:</th>
            <td>{minutesReadable(stats.minutesSaved, true)}</td>
          </tr>
        </tbody>
      </table>
      <div>
        <button
          on:click={async (_) => {
            await refresh();
          }}
          disabled={status === STATUS.WORKING}>Refresh</button>
      </div>
    {/if}

    <Status {status} />
  </div>
</main>

<style>
  table {
    margin: auto;
    width: 500px;
  }
  table th {
    width: 200px;
    text-align: right;
  }
  table td {
    width: 300px;
    padding-left: 16px;
    text-align: left;
  }
</style>
