const puppeteer = require("puppeteer");
const path = require("path");

async function vote(page) {
  const voteButtons = await page.$$(".vote-button");

  voteButtons[Math.floor(Math.random() * voteButtons.length)].click();
}

async function startBot(botIndex, context) {
  const page = await context.newPage();

  await page.goto(
    `http://localhost:5000/vote?userEmail=user${botIndex}@cypress.local&userPassword=cypress`
  );

  await page.waitForSelector(".vote-button");

  setInterval(() => {
    if (Math.random() > 0.5) {
      vote(page);
    }
  }, 1000);
}

(async function () {
  const browser = await puppeteer.launch();
  const context = await browser.createIncognitoBrowserContext();

  for (let botIndex = 1; botIndex <= 10; botIndex++) {
    startBot(botIndex, context);
  }
})();

process.on("SIGTERM", () => {
  browser.close().then(() => {
    process.exit(0);
  });
});
