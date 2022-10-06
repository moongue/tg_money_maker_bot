const { Scenes: { BaseScene }, Markup } = require('telegraf');
const { GREETING, CHOOSE_BUSINESS } = require('./scenes');
const { greeting, workTogether } = require('../messages.json');

const greetingScene = new BaseScene(GREETING);

greetingScene.start((ctx) => {
  ctx.replyWithMarkdownV2(
    greeting,
    Markup.keyboard([
      [workTogether],
    ]).oneTime().resize()
  );
});

greetingScene.hears(workTogether, (ctx) => ctx.scene.enter(CHOOSE_BUSINESS));

module.exports = greetingScene;
