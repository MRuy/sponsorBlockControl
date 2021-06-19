<script>
  import {ConfigStore} from '@/store.js';
  import Header from '@/components/Header.svelte';
  import Navigation from '@/components/Navigation.svelte';
  import Home from '@/pages/Home.svelte';
  import PageShadowBanUser from '@/pages/ShadowBanUser.svelte';
  import PageGetTotalStats from '@/pages/GetTotalStats.svelte';
  import PageVoteOnSponsorTime from '@/pages/VoteOnSponsorTime.svelte';
  import PageCategoryChange from '@/pages/CategoryChange.svelte';
  import PageUsername from '@/pages/Username.svelte';
  import AddUserAsVIP from '@/pages/AddUserAsVIP.svelte';
  import LockCategories from '@/pages/LockCategories.svelte';
  import WarnUser from './pages/WarnUser.svelte';
  import ClearCache from './pages/ClearCache.svelte';

  const componentList = [
    {
      name: 'Home',
      component: Home,
      uuidRequired: false,
    },
    {
      name: 'Username',
      component: PageUsername,
      uuidRequired: true,
    },
    {
      name: 'Stats',
      component: PageGetTotalStats,
      uuidRequired: false,
    },
    {
      name: 'Vote on segment',
      component: PageVoteOnSponsorTime,
      uuidRequired: true,
    },
    {
      name: 'Category change',
      component: PageCategoryChange,
      uuidRequired: true,
    },
    {
      name: 'Lock categories',
      component: LockCategories,
      uuidRequired: true,
    },
    {
      name: 'Add/Remove Shadow ban',
      component: PageShadowBanUser,
      uuidRequired: true,
    },
    {
      name: 'Warn user',
      component: WarnUser,
      uuidRequired: true,
    },
    {
      name: "Clear cache",
      component: ClearCache,
      uuidRequired: true,
    },
    {
      name: 'Add/Remove VIP',
      component: AddUserAsVIP,
      uuidRequired: true,
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
