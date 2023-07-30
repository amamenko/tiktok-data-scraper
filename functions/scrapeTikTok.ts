import "dotenv/config";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { exec } from "child_process";
import { PuppeteerLaunchOptions, executablePath } from "puppeteer";
import { logger } from "../logger/logger";
import { handlePuppeteerPage } from "./handlePuppeteerPage";

const stealth = StealthPlugin();
// Remove this specific stealth plugin from the default set
stealth.enabledEvasions.delete("user-agent-override");
puppeteer.use(stealth);

export const scrapeTikTok = async () => {
  const scrapingStatement = `♪ Now scraping Tik Tok data! ♪`;
  if (process.env.NODE_ENV === "production") {
    logger("server").info(scrapingStatement);
  } else {
    console.log(scrapingStatement);
  }
  // Kill all leftover Puppeteer processes
  exec("pkill -9 -f puppeteer");

  const puppeteerLaunchOptions = {
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--no-zygote",
      "--ignore-certificate-errors",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--single-process",
      "--disable-gpu",
      "--window-size=1920,1080",
    ],
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
    headless: "new",
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : executablePath(),
  } as PuppeteerLaunchOptions;

  try {
    const browser = await puppeteer.launch(puppeteerLaunchOptions);
    await handlePuppeteerPage(browser);
  } catch (e) {
    const twoMinutesStatement =
      "Now waiting two minutes before attempting to scrape again...";
    console.error(e);
    console.log(twoMinutesStatement);
    setTimeout(async () => {
      const scrapingStatement2 = `♪ Now attempting to scrape Tik Tok data a second time! ♪`;
      if (process.env.NODE_ENV === "production") {
        logger("server").info(scrapingStatement2);
      } else {
        console.log(scrapingStatement2);
      }
      try {
        // Kill all leftover Puppeteer processes
        exec("pkill -9 -f puppeteer");
        const browser2 = await puppeteer.launch(puppeteerLaunchOptions);
        await handlePuppeteerPage(browser2);
      } catch (err) {
        const secondTwoMinutesStatement =
          "Now waiting two minutes before attempting to scrape a third time...";
        console.error(err);
        console.log(secondTwoMinutesStatement);
        setTimeout(async () => {
          const scrapingStatement3 = `♪ Now attempting to scrape Tik Tok data a third time! ♪`;
          if (process.env.NODE_ENV === "production") {
            logger("server").info(scrapingStatement3);
          } else {
            console.log(scrapingStatement3);
          }
          try {
            // Kill all leftover Puppeteer processes
            exec("pkill -9 -f puppeteer");
            const browser3 = await puppeteer.launch(puppeteerLaunchOptions);
            await handlePuppeteerPage(browser3);
          } catch (error) {
            const abortStatement = "Aborting Tik Tok scraping process.";
            console.error(error);
            console.log(abortStatement);
          }
        }, 120000);
      }
    }, 120000);
  }
};
