const fs = require("fs");
const path = require("path");

async function writeFile(fileName, content) {
  var jsonPath = path.join(__dirname, "..", "data", `${fileName}`);

  await fs.writeFile(jsonPath, JSON.stringify(content), (error, data) => {
    if (error) {
      throw new Error("File write Error");
    }
  });
}

async function setChannel(channelId) {
  const data = {};
  data.channelId = channelId;
  await writeFile("channel.json", data);
}

function getChannel() {}

function parseContent(contentString) {
  const parseContent = contentString.split(" ");

  return {
    time: parseContent[1],
    content: parseContent.slice(2).join(" "),
  };
}

async function addContent(contentString, messageId) {
  console.log(contentString);

  const { time, content } = parseContent(contentString);
  console.log(time, content, messageId);
}

async function updateContent(contentObject) {}

function deleteContent(contentId) {}

function displayContent() {}

function checkForContent() {}

module.exports = { setChannel, addContent };
