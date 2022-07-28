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
  import AddUserAsTempVIP from '@/pages/AddUserAsTempVIP.svelte';
  import LockCategories from '@/pages/LockCategories.svelte';
  import WarnUser from './pages/WarnUser.svelte';
  import UserInfo from './pages/UserInfo.svelte';
  import ClearCachePurgeSegments from './pages/ClearCachePurgeSegments.svelte';
  import AddUserFeature from './pages/AddUserFeature.svelte';

  const websiteName = 'SponsorBlockControl';

  const componentList = [
    {
      name: 'home',
      title: 'Home',
      component: Home,
      uuidRequired: false,
    },
    {
      name: 'username',
      title: 'Username',
      component: PageUsername,
      uuidRequired: true,
    },
    {
      name: 'stats',
      title: 'Stats',
      component: PageGetTotalStats,
      uuidRequired: false,
    },
    {
      name: 'voteonsegment',
      title: 'Vote on segment',
      component: PageVoteOnSponsorTime,
      uuidRequired: true,
    },
    {
      name: 'categorychange',
      title: 'Category change',
      component: PageCategoryChange,
      uuidRequired: true,
    },
    {
      name: 'lockcategories',
      title: 'Lock categories',
      component: LockCategories,
      uuidRequired: true,
      requiresVIP: true,
    },
    {
      name: 'shadowban',
      title: 'Add/Remove Shadow ban',
      component: PageShadowBanUser,
      uuidRequired: true,
      requiresVIP: true,
    },
    {
      name: 'warnuser',
      title: 'Warn user',
      component: WarnUser,
      uuidRequired: true,
      requiresVIP: true,
    },
    {
      name: 'cachepurge',
      title: 'Clear cache / Purge segments',
      component: ClearCachePurgeSegments,
      uuidRequired: true,
      requiresVIP: true,
    },
    {
      name: 'vip',
      title: 'Add/Remove VIP',
      component: AddUserAsVIP,
      uuidRequired: true,
    },
    {
      name: 'tempvip',
      title: 'Add/Remove Temporary VIP',
      component: AddUserAsTempVIP,
      uuidRequired: true,
      requiresVIP: true,
    },
    {
      name: 'userinfo',
      title: 'User Info',
      component: UserInfo,
      uuidRequired: false,
    },
    {
      name: 'adduserfeature',
      title: 'Add User Feature',
      component: AddUserFeature,
      uuidRequired: true,
      requiresVIP: true,
    },
  ];

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  let GETPARAM_page = 'home';
  if (urlParams.has('page')) {
    const page = urlParams.get('page');
    if (componentList.some((item) => item.name === page)) {
      GETPARAM_page = page;
    }
  }
  let selectedComponent;

  selectComponent(GETPARAM_page);

  function selectComponent(name) {
    const result = componentList.find((item) => item.name === name);
    if (result) {
      selectedComponent = result.component;
      const url = new URL(window.location);
      const title = `${result.title} • ${websiteName}`;
      url.searchParams.set('page', name);
      window.history.pushState({}, title, url);
      document.title = title;
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
