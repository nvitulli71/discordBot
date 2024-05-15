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

function parseContent(contentString) {
  const parseContent = contentString.split(" ");

  return {
    time: parseContent[1],
    content: parseContent.slice(2).join(" "),
  };
}

async function addContent(contentString, messageId) {
  const { time, content } = parseContent(contentString);
  const newTime = modifyDate(time);
  await addContentToFile({ time: newTime, content, id: messageId });
  return newTime;
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

async function updateContent(contentObject, messageId) {}

function deleteContent(contentId) {}

function getContent() {
  const fileName = "content.json";
  let jsonPath = path.join(__dirname, "..", "data", `${fileName}`);
  if (fs.existsSync(jsonPath)) {
    const data = JSON.parse(fs.readFileSync(jsonPath));
    return data;
  } else {
    return {};
  }
}

function modifyDate(additionalTime) {
  const parsedTime = additionalTime.split(":");
  const additionalMinutes = (parsedTime[0] * 60 + parsedTime[1]) * 1000;
  const date = new Date();
  const updatedDate = date.setTime(date.getTime() + additionalMinutes);
  return Math.floor(updatedDate / 1000);
}

module.exports = { setChannel, addContent, getContent };
