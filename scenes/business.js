const { Scenes: { BaseScene }, Markup } = require('telegraf');
const { PrismaClient } = require('@prisma/client');
const { BUSINESS, CHOOSE_BUSINESS } = require('./scenes');
const { groupArrayToKeyboard, parseReceivedData } = require('../utils');
const { businessNotAvailable, back } = require('../messages.json');

const prisma = new PrismaClient();
const businessScene = new BaseScene(BUSINESS);

businessScene.enter(async (ctx) => {
  const { selectedBusiness } = ctx.session;
  const business = await prisma.business.findUnique({
    where: {
     id: selectedBusiness,
    },
    include: {
      steps: true
    }
  });

  if (!business) {
    await ctx.sendMessage(businessNotAvailable);
    return ctx.scene.enter(CHOOSE_BUSINESS);
  }

  const { steps = [], description = '' } = business;
  const prepareButtons = steps.sort((a, b) => a?.id - b?.id).map(({ button }) => button);

  await ctx.replyWithHTML(parseReceivedData(description), steps.length !== 0 && (
    Markup.keyboard(groupArrayToKeyboard([...prepareButtons, back], 2)).resize()
  ));

  if (steps.length === 0) {
    return ctx.scene.enter(CHOOSE_BUSINESS);
  }

  steps.forEach(({ button, message }) => {
    businessScene.hears(button, async (ctx) => {
      ctx.replyWithHTML(parseReceivedData(message));
    });
  });

  businessScene.hears(back, async (ctx) => {
    return ctx.scene.enter(CHOOSE_BUSINESS);
  });
});

module.exports = businessScene;
