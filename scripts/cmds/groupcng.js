const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "gc",
    version: "2.1",
    author: "SaGor",
    countDown: 5,
    role: 0, // ✅ Everyone can use
    category: "𝗚𝗥𝗢𝗨𝗣",
    guide: {
      en:
        ".gc name <new name>\n" +
        ".gc emoji <emoji>\n" +
        ".gc image (reply photo)"
    }
  },

  onStart: async function ({ api, event, args, message }) {

    if (!event.isGroup) return;

    const threadID = event.threadID;

    const autoUnsend = async (text) => {
      const msg = await message.reply(text);
      setTimeout(() => {
        api.unsendMessage(msg.messageID);
      }, 2000); // ⏳ 2 seconds
    };

    try {

      const option = args[0]?.toLowerCase();
      if (!option)
        return autoUnsend("❎");

      if (option === "name") {
        const newName = args.slice(1).join(" ");
        if (!newName)
          return autoUnsend("❎");

        await api.setTitle(newName, threadID);
        return autoUnsend("✅");
      }

      if (option === "emoji") {
        const emoji = args[1];
        if (!emoji)
          return autoUnsend("❎");

        await api.changeThreadEmoji(emoji, threadID);
        return autoUnsend("✅");
      }

      if (option === "image") {

        if (!event.messageReply?.attachments?.length)
          return autoUnsend("❎");

        const attachment = event.messageReply.attachments[0];

        if (attachment.type !== "photo")
          return autoUnsend("❎");

        const img = await axios.get(attachment.url, {
          responseType: "arraybuffer"
        });

        const filePath = path.join(__dirname, "cache_gc.png");
        fs.writeFileSync(filePath, img.data);

        await api.changeGroupImage(
          fs.createReadStream(filePath),
          threadID
        );

        fs.unlinkSync(filePath);

        return autoUnsend("✅");
      }

      return autoUnsend("❎");

    } catch (err) {
      console.error("GC ERROR:", err);
      return autoUnsend("❎");
    }
  }
};