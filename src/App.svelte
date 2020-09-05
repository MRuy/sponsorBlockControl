<script>
  import {ConfigStore} from './store.js';
  import Header from './components/Header.svelte';
  import Navigation from './components/Navigation.svelte';
  import Home from './pages/Home.svelte';
  import PageShadowBanUser from './pages/ShadowBanUser.svelte';
  import PageGetTotalStats from './pages/GetTotalStats.svelte';
  import PageGetTopUsers from './pages/GetTopUsers.svelte';
  import PageVoteOnSponsorTime from './pages/VoteOnSponsorTime.svelte';
  import PageUsername from './pages/Username.svelte';
  import AddUserAsVIP from './pages/AddUserAsVIP.svelte';
  import NoSegments from './pages/NoSegments.svelte';

  const componentList = [
    {
      name: 'Home',
      component: Home,
    },
    {
      name: 'Username',
      component: PageUsername,
    },
    {
      name: 'Stats',
      component: PageGetTotalStats,
    },
    {
      name: 'Leaderboard',
      component: PageGetTopUsers,
    },
    {
      name: 'Vote on segment',
      component: PageVoteOnSponsorTime,
    },
    {
      name: 'No segments',
      component: NoSegments,
    },
    {
      name: 'Add/Remove Shadow ban',
      component: PageShadowBanUser,
    },
    {
      name: 'Add/Remove VIP',
      component: AddUserAsVIP,
    },
  ];
  let selectedComponent = componentList[0].component;

  function selectComponent(name) {
    const result = componentList.find((item) => item.name === name);
    if (result) {
      selectedComponent = result.component;
    }
  }
</script>

<Header />
<Navigation
  items={componentList}
  clickHandler={selectComponent}
  selected={selectedComponent} />
<svelte:component this={selectedComponent} />

<style global>
  @import 'normalize.css';
  @import 'style.css';
</style>
