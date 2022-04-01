
// msw.cookie won't to work with me, so I wrote this workaround
export const parseCookies = () => {
  const records: Record<string, string> = {};
  const data = document.cookie.split('; ');

  for (const record of data) {
    const [key, data] = record.split('=');
    records[key] = data;
  }

  return records;
};
