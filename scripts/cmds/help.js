module.exports = {
  config: {
    name: "help",
    version: "2.1",
    author: "SaGor",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Show command list"
    },
    description: {
      en: "View all commands or specific command info"
    },
    category: "𝗦𝗬𝗦𝗧𝗘𝗠",
    guide: {
      en: "{p}help → Show all commands\n{p}help [command name]"
    }
  },

  onStart: async function ({ message, args }) {
    const { commands } = global.GoatBot;
    const prefix = global.GoatBot.config.prefix;

    if (args[0]) {
      const cmd = commands.get(args[0].toLowerCase());
      if (!cmd) return message.reply("❌ | Command not found.");

      return message.reply(
`╭━━━〔 🔎 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢 〕━━━╮
┃ 📝 Name: ${cmd.config.name}
┃ 👑 Author: ${cmd.config.author}
┃ 📂 Category: ${cmd.config.category}
┃ ⏳ Cooldown: ${cmd.config.countDown}s
┃ 📖 Description: ${cmd.config.description?.en || "No description"}
╰━━━〔 📌 Guide 〕━━━╯
${cmd.config.guide?.en?.replace(/{p}/g, prefix) || "No guide"}
`);
    }

    const categories = {};

    for (const [name, command] of commands) {
      const cat = command.config.category || "𝗢𝗧𝗛𝗘𝗥";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(name);
    }

    let msg = "╭━━━〔 🚀 𝗦𝗔𝗚𝗢𝗥 𝗕𝗢𝗧 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 〕━━━╮\n";

    for (const cat in categories) {
      msg += `\n╭─❖ 【 ✨ ${cat.toUpperCase()} ✨ 】\n`;
      msg += `│ ${categories[cat].join("  •  ")}\n`;
      msg += `╰─────────────────────\n`;
    }

    msg += `\n╰━━━〔 📊 Total: ${commands.size} Commands 〕━━━╯`;

    message.reply(msg);
  }
};