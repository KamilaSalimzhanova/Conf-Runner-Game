require('dotenv').config(); 
const { Telegraf, Markup } = require('telegraf');
const db = require('./db');

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error('Set BOT_TOKEN env var');

const bot = new Telegraf(BOT_TOKEN);

// старт
bot.start((ctx) => {
  return ctx.reply(
    'Conf Runner 🎮 Запускай игру!',
    Markup.inlineKeyboard([
      [ Markup.button.webApp('Играть', 'https://kamilasalimzhanova.github.io/Conf-Runner-Game/') ],
      [ Markup.button.callback('Показать топ', 'show_top') ]
    ])
  );
});

// принимаем результаты из игры
bot.on('message', async (ctx) => {
  const data = ctx.message?.web_app_data?.data;
  if (!data) return;

  try {
    const payload = JSON.parse(data); // { score: 123 }
    const score = Math.max(0, Number(payload.score) || 0);
    const uid = ctx.from.id;
    const name =
      `${ctx.from.first_name ?? ''} ${ctx.from.last_name ?? ''}`.trim() ||
      ctx.from.username ||
      `id${uid}`;

    const row = db.prepare('SELECT best FROM scores WHERE userId = ?').get(uid);

    if (!row) {
      db.prepare('INSERT INTO scores (userId, name, best) VALUES (?, ?, ?)').run(uid, name, score);
    } else if (score > row.best) {
      db.prepare('UPDATE scores SET best = ?, name = ? WHERE userId = ?').run(score, name, uid);
    }

    await ctx.reply(`✅ Результат принят: ${score} очков!`);
  } catch (e) {
    console.error(e);
    await ctx.reply('❌ Не удалось прочитать результат.');
  }
});

// топ-10
bot.action('show_top', (ctx) => {
  const top = db.prepare('SELECT name, best FROM scores ORDER BY best DESC LIMIT 10').all();
  if (!top.length) return ctx.answerCbQuery('Пока нет результатов');

  const text = top.map((r, i) => `${i + 1}. ${r.name} — ${r.best}`).join('\n');
  ctx.reply(`🏆 Топ-10 Conf Runner:\n${text}`);
  ctx.answerCbQuery();
});

bot.command('top', (ctx) => {
  const top = db.prepare('SELECT name, best FROM scores ORDER BY best DESC LIMIT 10').all();
  if (!top.length) return ctx.reply('Пока нет результатов. Нажми «Играть».');
  const text = top.map((r, i) => `${i + 1}. ${r.name} — ${r.best}`).join('\n');
  ctx.reply(`🏆 Топ-10 Conf Runner:\n${text}`);
});

bot.launch();
console.log('Bot started with SQLite DB');
