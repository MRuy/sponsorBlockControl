export const minutesReadable = (minutes, useLong = false) => {
  const years = Math.floor(minutes / 60 / 24 / 365);
  const days = Math.floor(minutes / 60 / 24) % 365;
  const hours = Math.floor(minutes / 60) % 24;
  let str = '';
  str += `${years > 0 ? years + (useLong ? ' years ' : 'y ') : ''}`;
  str += `${days > 0 ? days + (useLong ? ' days ' : 'd ') : ''}`;
  str += `${hours > 0 ? hours + (useLong ? ' hours ' : 'h ') : ''}`;
  if (years == 0) {
    str += `${(minutes % 60).toFixed(1)}${useLong ? ' minutes ' : 'm '}`;
  }
  return str.trim();
};

export const isValidUserUUID = (str) => {
  return /^[a-f0-9]{64}$/.test(str);
};

export const isValidSegmentUUID = (str) => {
  return /^([a-f0-9]{64}|[a-f0-9]{8}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{12})$/.test(
    str
  );
};
