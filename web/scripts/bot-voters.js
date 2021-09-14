const puppeteer = require("puppeteer");
const path = require("path");

const getBotIndex = (index) => (index >= 10 ? "10" : "0" + index);

async function vote(page) {
  const voteButtons = await page.$$(".vote-button");

  voteButtons[Math.floor(Math.random() * voteButtons.length)].click();
}

async function startBot(botIndex, context) {
  const page = await context.newPage();

  console.log("Bot", getBotIndex(botIndex), "opening app...");

  await page.goto(
    `http://localhost:5000/vote?userEmail=fake.user${botIndex}@local.dev&userPassword=fakeuser`
  );

  console.log("Bot", getBotIndex(botIndex), "accessed to the app.");

  await page.waitForSelector(".vote-button");

  console.log("Bot", getBotIndex(botIndex), "accessed to the voting page.");

  setInterval(() => {
    if (Math.random() > 0.5) {
      vote(page);
    }
  }, 1000);
}

try {
  (async function () {
    const browser = await puppeteer.launch();
    const context = await browser.createIncognitoBrowserContext();

    for (let botIndex = 1; botIndex <= 5; botIndex++) {
      startBot(botIndex, context);
    }
  })();
} catch (error) {
  console.log({ error });
}

process.on("SIGTERM", () => {
  browser.close().then(() => {
    process.exit(0);
  });
});
