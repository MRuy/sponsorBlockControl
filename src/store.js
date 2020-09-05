import {writable} from 'svelte-local-storage-store';

export const ConfigStore = writable('config', {
  privateUUID: '',
  sponsorBlockApi: 'https://sponsor.ajay.app',
  showPrivateUUID: false,
});

export const CacheStore = writable('cache', {});
