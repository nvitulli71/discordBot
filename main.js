const { Client, Events, GatewayIntentBits } = require("discord.js");
const { token, channel_id } = require("./config.json");
const {
  addContent,
  createEmbedData,
  deleteContentFromMessage,
} = require("./services/general.service");
const { startSlashCommands } = require("./services/slash_commands.service");

startSlashCommands();

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

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (interaction.channelId != channel_id) return;

  switch (commandName) {
    case "delete":
      const content_id = options.getString("content_id");
      await deleteContentFromMessage(content_id)
        .catch(async (err) => {
          await interaction.reply(
            `There was an issue deleting content. Please reach out to an admin.`
          );
          throw new Error(err);
        })
        .then(async (data) => {
          await interaction.reply(
            `Deleted content entry with ID: ${content_id}`
          );
          const embedData = await createEmbedData();
          await interaction.followUp({ embeds: embedData.flat() });
        })
        .catch(() => void 0);
      return;
    case "add_content":
      await addContent({
        content: options.getString("content"),
        time: options.getString("time"),
        imageUrl: options.getAttachment("image")?.url,
      })
        .catch(async (err) => {
          await interaction.reply(
            `There was an issue adding content. Please reach out to an admin.`
          );
          throw new Error(err);
        })
        .then(async (data) => {
          await interaction.reply(
            `Added a new content entry. Content will begin in <t:${data.discordTime}:R> at <t:${data.discordTime}:t> (\`${data.utcTime}\ UTC\`) on <t:${data.discordTime}:D>`
          );
          const embedData = await createEmbedData();
          await interaction.followUp({ embeds: embedData.flat() });
        })
        .catch((err) => console.log(err));
      return;
    case "list_content":
      const embedData = await createEmbedData();
      await interaction.reply({ embeds: embedData.flat() });
      return;
    default:
      break;
  }
});
