require('dotenv').config();

const { Telegraf, Scenes: { Stage }, Markup } = require('telegraf');
const RedisSession = require('telegraf-session-redis');
const { CHOOSE_BUSINESS } = require('./scenes/scenes');

// Scenes
const chooseBusinessScene = require('./scenes/chooseBusiness');
const businessScene = require('./scenes/business')
const { greeting, workTogether, help } = require('./messages.json');

const bot = new Telegraf(process.env.BOT_TOKEN);

const session = new RedisSession({
  store: {
    url: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
  }
});

const stage = new Stage([
  chooseBusinessScene,
  businessScene
]);

bot.use(session);
bot.use(stage.middleware());

bot.start((ctx) => {
  return ctx.replyWithMarkdownV2(
    greeting,
    Markup.keyboard([
      [workTogether],
    ]).oneTime().resize()
  );
});

bot.help((ctx) => ctx.sendMessage(help));

bot.hears(workTogether, (ctx) => ctx.scene.enter(CHOOSE_BUSINESS));

bot.launch();


process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));


module.exports = bot;
