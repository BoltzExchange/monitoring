import { Request, Response } from 'express';
import { set, get } from './Datastore';
import { getRequest } from './HttpClient';
import { sendMessage } from './DiscordClient';

const handleResponse = async (res: Response, url: string, error: any) => {
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

export const checkBoltzStatus = async (req: Request, res: Response) => {
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

    await handleResponse(res, boltzUrl, undefined);
  } catch (error) {
    await handleResponse(res, boltzUrl, error);
  }
};
