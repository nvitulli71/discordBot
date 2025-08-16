const { SlashCommandBuilder, REST, Routes } = require("discord.js");
const { token, application_id, server_id } = require("../config.json");

const slashCommands = [
  new SlashCommandBuilder()
    .setName("delete")
    .setDescription("Deletes a piece of content")
    .addStringOption((option) =>
      option
        .setName("content_id")
        .setDescription("The ID of the content to delete")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("add_content")
    .setDescription("Adds content to the list of content")
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription(
          "The amount of time from now the content is in hours and minutes HH:MM"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("content")
        .setDescription("The content you want to add")
        .setRequired(true)
    )
    .addAttachmentOption((option) =>
      option.setName("image").setDescription("An optional image")
    ),
  new SlashCommandBuilder()
    .setName("list_content")
    .setDescription("Lists all content"),
];

function startSlashCommands() {
  const rest = new REST().setToken(token);
  (async () => {
    try {
      console.log("Started refreshing application (/) commands.");
      await rest.put(Routes.applicationCommands(application_id, server_id), {
        body: slashCommands.map((command) => command.toJSON()),
      });
      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  })();
}

module.exports = { startSlashCommands };
