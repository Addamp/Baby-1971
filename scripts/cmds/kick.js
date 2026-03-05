module.exports = {
  config: {
    name: "kick",
    aliases: [],
    version: "1.2",
    author: "SaGor",
    countDown: 5,
    role: 1,
    shortDescription: "Kick members",
    longDescription: "Kick member by mention or reply",
    category: "group",
    guide: {
      en: "{pn} @user | reply message"
    }
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, mentions, messageReply } = event;

    let uids = [];

    if (Object.keys(mentions).length > 0) {
      uids = Object.keys(mentions);
    } 
    else if (messageReply) {
      uids.push(messageReply.senderID);
    } 
    else {
      return api.sendMessage("❌ | Mention or reply user to kick.", threadID, messageID);
    }

    for (const uid of uids) {
      try {
        await api.removeUserFromGroup(uid, threadID);
      } catch (e) {}
    }

    api.sendMessage(`✅ | ${uids.length} user kicked from the group.`, threadID, messageID);
  }
};
