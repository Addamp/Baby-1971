const axios = require("axios");

const baseApiUrl = async () => {
  return "https://image-api-swart.vercel.app";
};

const apiKey = async () => {
  return "sagor";
};

module.exports = {
  config: {
    name: "pin",
    version: "1.1",
    author: "SAGOR",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Pinterest image search"
    },
    longDescription: {
      en: "Search images"
    },
    category: "media",
    guide: {
      en: ".pin funny\n.pin cat 5"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      if (!args[0]) {
        return api.sendMessage("❌ | Enter search text", event.threadID, event.messageID);
      }

      const query = args[0];
      let amount = parseInt(args[1]) || 4;

      if (amount > 50) amount = 50;
      if (amount < 1) amount = 1;

      const base = await baseApiUrl();
      const key = await apiKey();

      const res = await axios.get(
        `${base}/sagor?q=${encodeURIComponent(query)}&limit=${amount}&apikey=${key}`
      );

      const data = res.data.data;

      if (!data || data.length === 0) {
        return api.sendMessage("❌ | No images found", event.threadID, event.messageID);
      }

      const img = [];

      for (const url of data) {
        img.push(await global.utils.getStreamFromURL(url));
      }

      api.sendMessage(
        {
          body: `📌 Search: ${query}\n🖼️ Images: ${data.length}`,
          attachment: img
        },
        event.threadID,
        event.messageID
      );

    } catch (error) {
      api.sendMessage("❌ | API Error", event.threadID, event.messageID);
    }
  }
};
