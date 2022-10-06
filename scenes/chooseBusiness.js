const { Scenes: { BaseScene }, Markup } = require('telegraf');
const { PrismaClient } = require('@prisma/client');
const { CHOOSE_BUSINESS, BUSINESS } = require('./scenes');
const { choose, chooseCorrectOption, buy, contact } = require('../messages.json');
const { groupArrayToKeyboard } = require('../utils');

const chooseOptions = ['🏆Перший🏆', '🥈Другий🥈', '🥉Третій🥉', 'Четвертий', 'П\'ятий', 'Шостий', 'Сьомий', 'Восьмий'];

const prisma = new PrismaClient();

const chooseBusinessScene = new BaseScene(CHOOSE_BUSINESS);

chooseBusinessScene.enter(async (ctx) => {
  const businesses = await prisma.business.findMany();
    const sortedBusinesses = businesses.sort((a, b) => a.name.localeCompare(b.name));
    const buttonsArray = sortedBusinesses.map(({ placeId }) => chooseOptions[placeId - 1]);
    buttonsArray.push(buy);

    await ctx.sendMessage(choose, Markup.keyboard(groupArrayToKeyboard(buttonsArray, 3)).resize());
});

chooseBusinessScene.on('text', async (ctx) => {
  const { text = '' } = ctx.message;

    if (text === buy) {
      await ctx.sendMessage(contact);
      return ctx.scene.enter(CHOOSE_BUSINESS);
    }

    const index = chooseOptions.indexOf(text) + 1;

    if (index === -1) {
      await ctx.sendMessage(chooseCorrectOption);
      return ctx.scene.enter(CHOOSE_BUSINESS);
    }

    ctx.session.selectedBusiness = index;

    return ctx.scene.enter(BUSINESS);
});

module.exports = chooseBusinessScene;
