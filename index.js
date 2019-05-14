const { set, get } = require('./datastore');
const { getRequest } = require('./httpClient');
const { sendMessage } = require('./discordClient');

const handleResponse = async (res, url, error) => {
  const unavailable = error !== undefined;
  const unavailableLastTime = await get(url);

  console.log(`Last result: ${unavailableLastTime}`);

  // Update just if the status changed
  if (unavailable !== unavailableLastTime) {
    await set(url, unavailable);
  }

  if (unavailable) {
    const message = `Boltz unavailable: ${error}`;

    if (!unavailableLastTime) {
      await sendMessage(`**${message}**`);
    }

    console.log(message);
    res.status(503).send({ error: message });
  } else {
    const message = 'Boltz is available';

    if (unavailableLastTime) {
      await sendMessage(`**${message} again**`);
    }

    console.log(message);
    res.send({});
  }
};

exports.checkBoltzStatus = async (req, res) => {
  const boltzUrl = req.query.url;

  if (boltzUrl === undefined || boltzUrl === '') {
    res.status(400).send({ error: 'no URL specified' });
    return;
  }

  console.log(`Checking Boltz URL: ${boltzUrl}`);

  try {
    const response = await getRequest(`https://${boltzUrl}/api/getpairs`);

    // Parse the response to make sure it is valid
    JSON.parse(response);

    handleResponse(res, boltzUrl);
  } catch (error) {
    handleResponse(res, boltzUrl, error);
  }
};
