/**
 * =====================================
 * Author: SAGOR
 * Coded with ➲ by SAGOR
 * =====================================
 */

const axios = require("axios");
const moment = require("moment-timezone");

const AZAN_AUDIO = "https://raw.githubusercontent.com/SAGOR-KINGx/SaGor/main/azan.mp3";

let sent = {};

module.exports = {
  config: {
    name: "azan",
    version: "4.0",
    author: "SAGOR",
    role: 0,
    shortDescription: "Auto Azan System",
    category: "islam",
    guide: "{p}azan [district]"
  },

  onStart: async function ({ api }) {

    const district = "Dhaka";

    setInterval(async () => {

      try {

        const res = await axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${district}&country=Bangladesh&method=1`);
        const t = res.data.data.timings;

        const prayers = {
          Fajr: t.Fajr.slice(0,5),
          Dhuhr: t.Dhuhr.slice(0,5),
          Asr: t.Asr.slice(0,5),
          Maghrib: t.Maghrib.slice(0,5),
          Isha: t.Isha.slice(0,5)
        };

        const now = moment().tz("Asia/Dhaka").format("HH:mm");

        const threads = await api.getThreadList(100, null, ["INBOX"]);

        for (let prayer in prayers) {

          if (now === prayers[prayer] && sent[prayer] !== now) {

            sent[prayer] = now;

            const audio = (await axios({
              url: AZAN_AUDIO,
              method: "GET",
              responseType: "stream"
            })).data;

            for (const thread of threads) {

              api.sendMessage({
                body:
`╭─❖
│ 🕌 𝐀𝐙𝐀𝐍 𝐀𝐋𝐄𝐑𝐓
├─•
│ 📿 Namaz: ${prayer}
│ ⏰ Time: ${prayers[prayer]}
│ 📍 District: ${district}
│
│ 🤲 নামাজের জন্য প্রস্তুত হোন
╰─────────────❖`,
                attachment: audio
              }, thread.threadID);

            }

          }

        }

      } catch (e) {
        console.log(e);
      }

    }, 30000);

  },

  onStartCommand: async function ({ api, event, args }) {

    const district = args.join(" ") || "Dhaka";

    try {

      const res = await axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${district}&country=Bangladesh&method=1`);
      const t = res.data.data.timings;

      const msg =
`🕌 Namaz Timetable

📍 District: ${district}

🌙 Fajr: ${t.Fajr}
☀️ Dhuhr: ${t.Dhuhr}
🌤 Asr: ${t.Asr}
🌇 Maghrib: ${t.Maghrib}
🌙 Isha: ${t.Isha}`;

      api.sendMessage(msg, event.threadID);

    } catch {

      api.sendMessage("❌ District not found", event.threadID);

    }

  }

};
