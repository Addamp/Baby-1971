const fs = require("fs-extra");
const axios = require("axios");
const { utils } = global;

let usedVideos = [];

module.exports = {
	config: {
		name: "prefix",
		version: "1.7",
		author: "SaGor",
		countDown: 5,
		role: 0,
		shortDescription: "Show bot prefix",
		longDescription: "Prefix panel with random video",
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
				"https://sagor-apis-xyz.vercel.app/video/list?key=sagor&name=sad"
			);

			const videos = res.data.videos;

			if (!videos || videos.length === 0)
				return message.reply("No videos found.");

			if (usedVideos.length === videos.length)
				usedVideos = [];

			const available = videos.filter(v => !usedVideos.includes(v.url));

			const random = available[Math.floor(Math.random() * available.length)];

			usedVideos.push(random.url);

			const cachePath = __dirname + "/cache";

			if (!fs.existsSync(cachePath))
				fs.mkdirSync(cachePath);

			const filePath = cachePath + "/prefix.mp4";

			const video = await axios({
				url: random.url,
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
