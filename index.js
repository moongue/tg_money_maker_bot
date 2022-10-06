require('dotenv').config();

const { Telegraf, Scenes: { Stage } } = require('telegraf');
const RedisSession = require('telegraf-session-redis');

// Scenes
const { GREETING } = require('./scenes/scenes');
const greetingScene = require('./scenes/greeting');
const chooseBusinessScene = require('./scenes/chooseBusiness');
const businessScene = require('./scenes/business')

const bot = new Telegraf(process.env.BOT_TOKEN);

const session = new RedisSession({
  store: {
    url: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
  }
});

const stage = new Stage([
  greetingScene,
  chooseBusinessScene,
  businessScene
]);

bot.use(session);
bot.use(stage.middleware());
bot.start((ctx) => ctx.scene.enter(GREETING));

bot.launch();


process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));


module.exports = bot;
