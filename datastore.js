const { Datastore } = require('@google-cloud/datastore');

const kind = 'monitoringResult';

const datastore = new Datastore();

const getKey = url => {
  return datastore.key([kind, url]);
};

exports.set = (url, failed) => {
  return datastore.save({
    key: getKey(url),
    data: {
      failed,
    },
  });
};

exports.get = async url => {
  const results = await datastore.get(getKey(url));

  if (results.length > 0) {
    const result = results[0];

    if (result !== undefined) {
      return results[0].failed;
    }
  }

  return false;
};
