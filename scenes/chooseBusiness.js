const { Scenes: { WizardScene }, Markup } = require('telegraf');
const { PrismaClient } = require('@prisma/client');
const { CHOOSE_BUSINESS, BUSINESS } = require('./scenes');
const { choose } = require('../messages.json');
const { groupArrayToKeyboard } = require('../utils');

const chooseOptions = ['🏆Перший🏆', '🥈Другий🥈', '🥉Третій🥉', 'Четвертий', 'П\'ятий', 'Шостий', 'Сьомий', 'Восьмий'];

const prisma = new PrismaClient();

const chooseBusinessScene = new WizardScene(
  CHOOSE_BUSINESS,
  async (ctx) => {
    const businesses = await prisma.business.findMany();

    const sortedBusinesses = businesses.sort((a, b) => a.name.localeCompare(b.name));
    const buttonsArray = sortedBusinesses.map(({ placeId }) => chooseOptions[placeId - 1]);

    await ctx.sendMessage(choose, Markup.keyboard(groupArrayToKeyboard(buttonsArray, 3)).oneTime().resize());
    return ctx.wizard.next();
  },
  async (ctx) => {
    const { text = '' } = ctx.message;
    const index = chooseOptions.indexOf(text) + 1;

    if (index === -1) {
      await ctx.sendMessage('Оберіть один з варіантів');
      return ctx.wizard.selectStep(0);
    }

    ctx.session.selectedBusiness = index;

    return ctx.scene.enter(BUSINESS);
  }
);

module.exports = chooseBusinessScene;
