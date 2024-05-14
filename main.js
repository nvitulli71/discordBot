const { Client, Events, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");
const { setChannel, addContent } = require("./services/general.service");

const COMMAND_PREFIX = "!";

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

client.on("messageCreate", async (message) => {
  const serverId = message.guild.id; // Will eventually need if using a DB
  const channelId = message.channel.id;
  const messageId = message.id;
  // Make sure this is the right channel

  if (message.author.bot) return;
  if (!message.content || !message.content.startsWith(COMMAND_PREFIX)) return;
  if (message.content.startsWith(COMMAND_PREFIX)) {
    switch (true) {
      case message.content.startsWith(`${COMMAND_PREFIX}set_channel`):
        let channelId = message.content.replace(/\D/g, "");
        await setChannel(channelId)
          .catch(() => {
            message.react("❌");
            message.reply(
              "There was an issue setting the channel to display content..."
            );
          })
          .finally(() => {
            message.react("✅");
            message.reply("Channel was set...");
          });
      case message.content.startsWith(`${COMMAND_PREFIX}content_in`):
        let content = message.content;
        await addContent(content, messageId)
          .catch(() => {
            message.react("❌");
            message.reply("There was an issue adding in content...");
          })
          .finally(message.react("✅"));
      case message.content.startsWith(`${COMMAND_PREFIX}all_content`):
      // Something here
      default:
        return;
    }

    //Do logic here to store the string value

    // Need a command that will hold the channel we need to be watching
    // Need a service here that we will pass the serverId and message into
    // Will need to parse the message for time and type of content
    // Will need to keep a timer somewhere to check every so often (maybe at the top of each hour and a command to show content comming up)
  }
});
