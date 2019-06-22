import { postRequest } from './HttpClient';

const discordWebhook = process.env.DISCORD_WEBHOOK;

export const sendMessage = (content: string) => {
  console.log(`Sending Discord message: ${content}`);

  return postRequest(discordWebhook, { content });
};
