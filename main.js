const {
  Client,
  Events,
  GatewayIntentBits,
  EmbedBuilder,
} = require("discord.js");
const { token } = require("./config.json");
const {
  setChannel,
  addContent,
  createEmbedData,
  deleteContentFromMessage,
} = require("./services/general.service");
const { channelId } = require("./data/channel.json");

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
  const server_id = message.guild.id; // Will eventually need if using a DB
  const channel_id = message.channel.id;
  const message_id = message.id;
  const setChannelId = channelId;
  // Make sure this is the right channel

  if (message.author.bot) return;
  if (!message.content || !message.content.startsWith(COMMAND_PREFIX)) return;
  if (message.content.startsWith(COMMAND_PREFIX)) {
    let content = message.content;

    switch (true) {
      case message.content.startsWith(`${COMMAND_PREFIX}set_channel`):
        let channelId = message.content.replace(/\D/g, "");
        await setChannel(channelId)
          .catch(() => {
            message.react("❌");
            message.reply(
              "There was an issue setting the channel to display content..."
            );
            return Promise.reject();
          })
          .then(() => {
            message.react("✅");
            message.reply("Channel was set...");
          })
          .catch(() => void 0);
        return;
      case setChannelId === channel_id:
        switch (true) {
          case message.content.startsWith(`${COMMAND_PREFIX}content_in`):
            await addContent(content, message_id, message.url)
              .catch((err) => {
                message.react("❌");
                message.reply("There was an issue adding in content...");
                throw new Error(err);
              })
              .then((data) => {
                message.react("✅");
                message.reply(
                  `Content will begin in <t:${data.discordTime}:R> at <t:${data.discordTime}:t> (\`${data.utcTime}\ UTC\`) on <t:${data.discordTime}:D>`
                );
              })
              .catch(() => void 0);
            return;
          case message.content.startsWith(`${COMMAND_PREFIX}all_content`):
            const data = await createEmbedData();
            const exampleEmbed = new EmbedBuilder()
              .setColor(0x0099ff)
              .setTitle("Calm Content")
              .addFields(data)
              .setTimestamp();
            client.channels.cache
              .get(setChannelId)
              .send({ embeds: [exampleEmbed] });
            return;
          case message.content.startsWith(`${COMMAND_PREFIX}delete`):
            await deleteContentFromMessage(content)
              .catch((err) => {
                message.react("❌");
                message.reply("There was an issue deleting this content...");
                throw new Error(err);
              })
              .then((data) => {
                message.react("✅");
                message.reply(`Content has been deleted...`);
              })
              .catch(() => void 0);
            return;
          default:
            return;
        }

      default:
        return;
    }

    // Need a service here that we will pass the serverId and message into
    // Will need to parse the message for time and type of content
    // Will need to keep a timer somewhere to check every so often (maybe at the top of each hour and a command to show content comming up)
  }
});
