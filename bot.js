const { Telegraf, Markup } = require('telegraf');
const BOT_TOKEN = "8107398523:AAHtOK9ZB53ONfgXaGrNclKQLX995R6PLKA";
if (!BOT_TOKEN) throw new Error('Set BOT_TOKEN env var');

const bot = new Telegraf(BOT_TOKEN);

// Простой лидерборд в памяти процесса (для демо без внешних сервисов)
const scores = new Map(); // userId -> { name, best }

bot.start((ctx) => {
  return ctx.reply(
    'Conf Runner 🎮 Запускай игру!',
    Markup.inlineKeyboard([
      [ Markup.button.webApp('Играть', 'https://kamilasalimzhanova.github.io/Conf-Runner-Game/') ],
      [ Markup.button.callback('Показать топ', 'show_top') ]
    ])
  );
});

// принимаем данные из Mini App: ctx.message.web_app_data.data (string)
bot.on('message', async (ctx) => {
  const data = ctx.message?.web_app_data?.data;
  if (!data) return; // обычные сообщения игнорируем

  try {
    const payload = JSON.parse(data); // { game, score, ts }
    const score = Math.max(0, Number(payload.score) || 0);
    const uid = ctx.from.id;
    const name = `${ctx.from.first_name ?? ''} ${ctx.from.last_name ?? ''}`.trim() || ctx.from.username || `id${uid}`;

    const prev = scores.get(uid)?.best ?? -Infinity;
    if (score > prev) scores.set(uid, { name, best: score });

    await ctx.reply(`✅ Результат принят: ${score} очков!`);
  } catch (e) {
    await ctx.reply('❌ Не удалось прочитать результат.');
  }
});

bot.action('show_top', (ctx) => {
  const top = [...scores.values()].sort((a,b) => b.best - a.best).slice(0,10);
  if (!top.length) return ctx.answerCbQuery('Пока нет результатов');

  const text = top.map((r,i)=> `${i+1}. ${r.name} — ${r.best}`).join('\n');
  ctx.reply(`🏆 Топ-10 Conf Runner:\n${text}`);
  ctx.answerCbQuery();
});

bot.command('top', (ctx) => {
  const top = [...scores.values()].sort((a,b) => b.best - a.best).slice(0,10);
  if (!top.length) return ctx.reply('Пока нет результатов. Нажми «Играть».');
  const text = top.map((r,i)=> `${i+1}. ${r.name} — ${r.best}`).join('\n');
  ctx.reply(`🏆 Топ-10 Conf Runner:\n${text}`);
});

bot.launch();
console.log('Bot started');
