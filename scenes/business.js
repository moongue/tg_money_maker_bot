const { Scenes: { BaseScene }, Markup } = require('telegraf');
const { PrismaClient } = require('@prisma/client');
const { BUSINESS, CHOOSE_BUSINESS } = require('./scenes');
const { groupArrayToKeyboard } = require('../utils');
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

  await ctx.sendMessage(description, steps.length !== 0 && (
    Markup.keyboard(groupArrayToKeyboard([...steps.map(({ button }) => button), back], 2)).resize()
  ));

  if (steps.length === 0) {
    return ctx.scene.enter(CHOOSE_BUSINESS);
  }

  steps.forEach(({ button, message }) => {
    businessScene.hears(button, async (ctx) => {
      const parsedMessage = message.replace(/\\n/g, '\n');
      ctx.replyWithHTML(parsedMessage);
    });
  });

  businessScene.hears(back, async (ctx) => {
    return ctx.scene.enter(CHOOSE_BUSINESS);
  });
});

module.exports = businessScene;
