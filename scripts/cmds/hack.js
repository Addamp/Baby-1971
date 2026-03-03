const { loadImage, createCanvas } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
  config: {
    name: "hack",
    author: "SaGor",
    countDown: 5,
    role: 0,
    category: "fun"
  },

  onStart: async function ({ args, api, event }) {
    try {
      const cachePath = __dirname + "/cache";
      fs.ensureDirSync(cachePath);

      let id;
      if (event.messageReply) id = event.messageReply.senderID;
      else if (Object.keys(event.mentions).length > 0)
        id = Object.keys(event.mentions)[0];
      else if (args[0]) id = args[0];
      else id = event.senderID;

      const userInfo = await api.getUserInfo(id);
      const name = userInfo[id]?.name || "User";

      // ===== HACK ANIMATION =====
      const msg = await api.sendMessage(
        `Hacking Facebook Password for ${name}, Please wait...`,
        event.threadID
      );

      const msgID = msg.messageID;

      await new Promise(r => setTimeout(r, 3000));
      await api.editMessage(
        `Successfully Cracked Facebook password for *${name}*`,
        msgID
      );

      await new Promise(r => setTimeout(r, 3000));
      await api.editMessage(
        `Login failed! 2FA is enabled on *${name}*'s account.`,
        msgID
      );

      await new Promise(r => setTimeout(r, 3000));
      await api.editMessage(
        `2FA Bypass Successful! Logged into ${name}'s account.`,
        msgID
      );

      // ===== IMAGE PART =====
      const pathImg = cachePath + "/hack.png";
      const pathAvt = cachePath + "/avatar.png";

      const avatarData = (
        await axios.get(
          `https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
          { responseType: "arraybuffer" }
        )
      ).data;

      const backgroundData = (
        await axios.get(
          "https://i.ibb.co/DCLzrQQ/VQXViKI.png",
          { responseType: "arraybuffer" }
        )
      ).data;

      fs.writeFileSync(pathAvt, Buffer.from(avatarData));
      fs.writeFileSync(pathImg, Buffer.from(backgroundData));

      const base = await loadImage(pathImg);
      const avatar = await loadImage(pathAvt);

      const canvas = createCanvas(base.width, base.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(base, 0, 0);
      ctx.drawImage(avatar, 83, 437, 100, 101);

      ctx.font = "400 23px Arial";
      ctx.fillStyle = "#1878F3";
      ctx.fillText(name, 200, 497);

      fs.writeFileSync(pathImg, canvas.toBuffer());
      fs.removeSync(pathAvt);

      await api.sendMessage(
        {
          body: `Successfully hacked ${name}\nPlease check your inbox to get Number and Password`,
          attachment: fs.createReadStream(pathImg),
        },
        event.threadID,
        () => fs.unlinkSync(pathImg),
        event.messageID
      );

      // ===== AUTO UNSEND AFTER IMAGE =====
      setTimeout(() => {
        api.unsendMessage(msgID);
      }, 3000);

    } catch (err) {
      api.sendMessage("❌ Error occurred!", event.threadID);
    }
  }
};
