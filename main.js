const { Client, Events, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");

const COMMAND_PREFIX = "!content_in";

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (!message.content || !message.content.startsWith(COMMAND_PREFIX)) return;
  if (message.content.startsWith(COMMAND_PREFIX)) {
    //Do logic here to store the string value
  }
});
