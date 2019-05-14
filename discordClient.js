const { postRequest } = require('./httpClient');

const discordWebhook = process.env.DISCORD_WEBHOOK;

exports.sendMessage = content => {
  console.log(`Sending Discord message: ${content}`);
  return postRequest(discordWebhook, { content });
};
