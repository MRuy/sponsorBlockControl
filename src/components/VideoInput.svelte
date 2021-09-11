<script>
  export let value = '';
  // Regexp from https://webapps.stackexchange.com/a/101153
  const YT_VIDEOID_REGEXP = new RegExp('^[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]$');

  function parsePastedText(str) {
    if (str.startsWith('http')) {
      try {
        const url = new URL(str);
        // YouTube URL
        if (url.searchParams.has('v')) {
          return url.searchParams.get('v');
        }
        // YouTube share url
        if (url.host === 'youtu.be') {
          return url.pathname.substring(1);
        }
        // SB Browser
        if (url.host === 'sb.ltn.fi') {
          if (url.pathname.includes('/video/')) {
            const folders = url.pathname.split('/');
            const videoIndex = folders.indexOf('video');
            const videoIdIndex = videoIndex + 1;
            if (videoIndex !== -1 && folders.length - 1 >= videoIdIndex) {
              return folders[videoIdIndex];
            }
          } else {
            if (url.searchParams.has('videoid')) {
              return url.searchParams.get('videoid');
            }
          }
        }
      }
      catch(error) {
        console.error('Failed to parse URL', str, error);
      }
    }
    return str;
  }
</script>

<input
  type="text"
  placeholder="VideoID or URL..."
  {...$$props}
  bind:value={value}
  on:paste|preventDefault={event => value = parsePastedText(event?.clipboardData?.getData('text'))}
/>

<style>

</style>
