const fs = require("fs-extra");
const axios = require("axios");
const { utils } = global;

module.exports = {
	config: {
		name: "prefix",
		version: "1.4",
		author: "SaGor",
		countDown: 5,
		role: 0,
		shortDescription: "Show bot prefix",
		longDescription: "Show prefix with styled panel",
		category: "info"
	},

	langs: {
		en: {
			myPrefix:
`┌─❖
│ 🚨 𝗦𝗔𝗚𝗢𝗥 𝗕𝗢𝗧
├─•
│ 🌐 𝗦𝘆𝘀𝘁𝗲𝗺 𝗣𝗿𝗲𝗳𝗶𝘅 : %1
│ 🛸 𝗚𝗿𝗼𝘂𝗽 𝗣𝗿𝗲𝗳𝗶𝘅  : %2
└─❖`
		}
	},

	onStart: async function () {},

	onChat: async function ({ event, message, getLang }) {

		if (event.body && event.body.toLowerCase() === "prefix") {

			const res = await axios.get(
				"https://sagor-apis-xyz.vercel.app/category/get?key=sagor&name=sad"
			);

			const videoURL = res.data.video;

			const cachePath = __dirname + "/cache";

			if (!fs.existsSync(cachePath))
				fs.mkdirSync(cachePath);

			const filePath = cachePath + "/prefix.mp4";

			const video = await axios({
				url: videoURL,
				method: "GET",
				responseType: "arraybuffer"
			});

			fs.writeFileSync(filePath, Buffer.from(video.data));

			return message.reply({
				body: getLang(
					"myPrefix",
					global.GoatBot.config.prefix,
					utils.getPrefix(event.threadID)
				),
				attachment: fs.createReadStream(filePath)
			}, () => fs.unlinkSync(filePath));
		}
	}
};
