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

const COMMAND_PREFIX = "!";
let messageCount = 0;

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
  const { channelId } = require("./data/channel.json");

  const server_id = message.guild.id; // Will eventually need if using a DB
  const channel_id = message.channel.id;
  const message_id = message.id;
  let setChannelId = channelId;

  // Make sure this is the right channel
  if (messageCount === 5) {
    messageCount = 0;
    const data = await createEmbedData();
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("FO Content")
      .addFields(data)
      .setTimestamp();
    client.channels.cache.get(setChannelId).send({ embeds: [exampleEmbed] });
  }

  if (message.author.bot) return;
  if (!message.content || !message.content.startsWith(COMMAND_PREFIX)) {
    if (setChannelId === channel_id) messageCount++;
    return;
  }
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
            setChannelId = channelId;
          })
          .catch(() => void 0);
        return;
      case setChannelId === channel_id:
        messageCount++;
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
          case message.content.startsWith(`${COMMAND_PREFIX}help_content`):
            const helpEmbed = new EmbedBuilder()
              .setColor(0x0099ff)
              .setTitle("Content Bot Commants")
              .addFields(
                {
                  name: "Add Content",
                  value: "`!content_in [HH:MM] [Content Description]`",
                },
                {
                  name: "Delete Content",
                  value: "`!delete [Content ID]`",
                },
                {
                  name: "Show All Content",
                  value: "`!all_content`",
                }
              )
              .setTimestamp();
            client.channels.cache
              .get(setChannelId)
              .send({ embeds: [helpEmbed] });
            return;
          default:
            return;
        }
      default:
        return;
    }
  }
});
