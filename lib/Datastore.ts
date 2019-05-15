import { Datastore } from '@google-cloud/datastore';

const kind = 'monitoringResult';

const datastore = new Datastore();

const getKey = (url: string) => {
  return datastore.key([kind, url]);
};

export const set = (url: string, failed: boolean) => {
  return datastore.save({
    key: getKey(url),
    data: {
      failed,
    },
  });
};

export const get = async (url: string) => {
  const results = await datastore.get(getKey(url));

  if (results.length > 0) {
    const result = results[0];

    if (result !== undefined) {
      return results[0].failed;
    }
  }

  return false;
};
