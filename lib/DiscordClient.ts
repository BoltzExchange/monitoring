import { postRequest } from './HttpClient';

const discordWebhook = process.env.DISCORD_WEBHOOK;

export const sendMessage = async (content: string) => {
  if (discordWebhook) {
    console.log(`Sending Discord message: ${content}`);

    await postRequest(discordWebhook, { content });
  } else {
    console.log('Could not send Discord message because no webhook address was provided');
  }
};
