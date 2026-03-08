module.exports = {
	config: {
		name: "goiadmin",
		author: "SaGor",
		role: 0,
		shortDescription: "",
		longDescription: "",
		category: "BOT",
		guide: "{pn}"
	},

	onChat: async function({ api, event }) {

		const adminID = "100029990749091","100088836995808","61587371774365",""61586860661824;

		if (event.senderID == adminID) return;

		if (event.mentions && Object.keys(event.mentions).includes(adminID)) {

			const msg = [
				"স্যার এখন ব্যস্ত আছে",
				"বস এখন ঘুমিয়ে আছে মেনশন দিয়েন না ডিস্টার্ব হবে",
				"বস এখন লাইনে নেই লাইনে আসলে আপনার সাথে কথা বলবে",
				"স্যার একটু ব্যস্ত আছি লাইনে আসলে আপনার সাথে কথা বলবে",
				"বস এখন ব্যস্ত আছে",
				"বেশি প্রয়োজন হলে তার ইনবক্সে যোগাযোগ করুন",
				"অযথা মেনশন দিয়ে লাভ নাই বস এখন ফোনের কাছে নাই",
				"বস তো ঘুমায়া পড়ছে, এখন ডাক দিয়া লাভ নাই!",
				"এতবার মিনশন দিয়া লাভ নাই, উনি তো বিজি ইন লাভ!",
				"অপেক্ষা করেন লাইনে আসলে কথা বলবে"
			];

			return api.sendMessage(
				{ body: msg[Math.floor(Math.random() * msg.length)] },
				event.threadID,
				event.messageID
			);
		}
	},

	onStart: async function() {}
};
