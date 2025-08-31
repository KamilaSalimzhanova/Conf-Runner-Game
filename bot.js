require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");

const BOT_TOKEN = process.env.BOT_TOKEN; // Render сам подставит сюда
const WEBAPP_URL = "https://kamilasalimzhanova.github.io/Conf-Runner-Game/"; // фронтенд на GitHub Pages

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    "Привет! 🚀 Жми кнопку и играй:",
    Markup.keyboard([
      Markup.button.webApp("🎮 Играть", WEBAPP_URL)
    ]).resize()
  );
});

bot.launch();
console.log("🤖 Bot started");

//👉 API для очков (/score, /leaders) будет работать через Render.
// 👉 Но саму игру ты открываешь с GitHub Pages.