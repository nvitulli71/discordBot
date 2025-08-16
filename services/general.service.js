const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

function writeFile(fileName, content) {
  var jsonPath = path.join(__dirname, "..", "data", `${fileName}`);

  fs.writeFileSync(jsonPath, JSON.stringify(content));
}

async function setChannel(channelId) {
  const data = {};
  data.channelId = channelId;
  writeFile("channel.json", data);
}

function parseContent(contentString) {
  const parseContent = contentString.split(" ");

  return {
    time: parseContent[1],
    content: parseContent.slice(2).join(" "),
  };
}

async function createEmbedData() {
  await cleanUpContent();

  const { content } = await getContent();
  content.sort((a, b) => a.time - b.time);
  let responseEmbeds = [];
  content.forEach((element) => {
    responseEmbeds.push(
      new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(`${element.content || "Unknown Content"}`)
        .setDescription(
          `**${element.content || "Unknown Content"}** in <t:${
            element.time
          }:R> at <t:${element.time}:t> (\`${element.utcTime}\ UTC\`) on <t:${
            element.time
          }:D>`
        )
        .setImage(element.imageUrl)
        .setFooter({ text: `Content ID: ${element.id}` })
        .setTimestamp()
    );
  });

  return responseEmbeds;
}

async function cleanUpContent() {
  const { content } = await getContent();
  let contentCopy = JSON.parse(JSON.stringify(content));

  const date = new Date();
  content.forEach(async (element) => {
    let currentTime = Math.floor(date.getTime() / 1000);
    if (currentTime > element.time) {
      const index = contentCopy.findIndex((i) => {
        return i.id === element.id;
      });
      contentCopy.splice(index, 1);
    }
  });

  const fileName = "content.json";
  let jsonPath = path.join(__dirname, "..", "data", `${fileName}`);
  if (fs.existsSync(jsonPath)) {
    const data = JSON.parse(fs.readFileSync(jsonPath));
    data["content"] = contentCopy;
    writeFile(fileName, data);
  }
}

async function addContent(contentString) {
  const { time, content, imageUrl } = contentString;
  const { discordTime, utcTime } = modifyDate(time);
  await addContentToFile({
    time: discordTime,
    content,
    id: Date.now(),
    imageUrl: imageUrl,
    utcTime,
  });
  return { discordTime, utcTime };
}

async function addContentToFile(contentObject) {
  const fileName = "content.json";
  let jsonPath = path.join(__dirname, "..", "data", `${fileName}`);
  if (fs.existsSync(jsonPath)) {
    const data = JSON.parse(fs.readFileSync(jsonPath));
    data["content"].push(contentObject);
    writeFile(fileName, data);
  } else {
    writeFile(fileName, { content: [contentObject] });
  }
}

async function deleteContentFromMessage(messageId) {
  await deleteContent(messageId);
}

async function deleteContent(contentId) {
  const { content } = await getContent();

  const updatedArray = content.filter((content) => content.id != contentId);

  const fileName = "content.json";
  let jsonPath = path.join(__dirname, "..", "data", `${fileName}`);
  if (fs.existsSync(jsonPath)) {
    const data = JSON.parse(fs.readFileSync(jsonPath));
    data["content"] = updatedArray;
    writeFile(fileName, data);
  }
}

async function getContent() {
  const fileName = "content.json";
  let jsonPath = path.join(__dirname, "..", "data", `${fileName}`);
  if (fs.existsSync(jsonPath)) {
    const data = JSON.parse(fs.readFileSync(jsonPath));
    return data;
  } else {
    return { content: [] };
  }
}

function modifyDate(additionalTime) {
  const parsedTime = additionalTime.split(":");
  const additionalMinutes =
    (Number(parsedTime[0]) * 60 + Number(parsedTime[1])) * 60 * 1000;
  const date = new Date();
  const updatedDate = date.setTime(date.getTime() + additionalMinutes);
  let dateObj = new Date(updatedDate);
  let hours = dateObj.getUTCHours();
  let minutes = dateObj.getUTCMinutes();
  let utcTime =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0");
  if (isNaN(updatedDate)) throw new Error("error with time");
  return { discordTime: Math.floor(updatedDate / 1000), utcTime };
}

module.exports = {
  setChannel,
  addContent,
  deleteContentFromMessage,
  createEmbedData,
};
