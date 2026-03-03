const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "pastebin",
    aliases: ["bin"],
    version: "3.0",
    author: "SaGor",
    countDown: 5,
    role: 0,
    shortDescription: "Upload command code",
    longDescription: "Upload command file and return only raw link (no API key)",
    category: "utility",
    guide: "{pn} <commandName>"
  },

  onStart: async function ({ message, args }) {

    const cmdName = args[0];
    if (!cmdName) return;

    const cmdPath = path.join(__dirname, `${cmdName}.js`);
    if (!fs.existsSync(cmdPath)) return;

    try {
      const code = fs.readFileSync(cmdPath, "utf8");

      const response = await axios.post(
        "https://paste.rs",
        code,
        {
          headers: { "Content-Type": "text/plain" }
        }
      );

      // ✅ Only link send
      return message.reply(response.data.trim());

    } catch (err) {
      console.error("UPLOAD ERROR:", err.message);
    }
  }
};