require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBAPP_URL = "https://kamilasalimzhanova.github.io/Conf-Runner-Game/";

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
