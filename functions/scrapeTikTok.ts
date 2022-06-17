const axios = require("axios");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { exec } = require("child_process");
require("dotenv").config();

const stealth = StealthPlugin();
// Remove this specific stealth plugin from the default set
stealth.enabledEvasions.delete("user-agent-override");
puppeteer.use(stealth);

export const scrapeTikTok = async () => {
  // Kill all leftover Puppeteer processes
  exec("pkill -9 -f puppeteer");

  try {
    const browser = await puppeteer.launch({
      args: [
        "--disable-setuid-sandbox",
        "--single-process",
        "--no-sandbox",
        "--no-zygote",
      ],
    });
    const page = await browser.newPage();

    await page.goto("https://live-backstage.tiktok.com/login?loginType=email", {
      waitUntil: "networkidle2",
    });

    await page.waitForTimeout(5000);

    await page.screenshot({ path: "test.png" });

    try {
      await page.click("button.semi-button-secondary");
    } catch (e) {
      console.error("No log in button found!");
    }

    await page.focus('input[placeholder="Enter email address"]');
    await page.keyboard.type(process.env.TIK_TOK_EMAIL);
    await page.focus('input[placeholder="Enter password"]');
    await page.keyboard.type(process.env.TIK_TOK_PASSWORD);
    try {
      await page.click("button.semi-button-tertiary.semi-button-size-large");
    } catch (e) {
      console.error("No log in button found!");
    }
    const findByTextAndClick = async (query: string) => {
      try {
        const [button] = await page.$x(
          `//span.semi-navigation-item-text[contains(., '${query}')]`
        );
        if (button) {
          await button.click();
        }
      } catch (e) {
        console.error(`No ${query} section button found!`);
      }
    };

    findByTextAndClick("Hosts");
    findByTextAndClick("LIVE now");

    await page.waitForTimeout(10000);

    await page.screenshot({ path: "test1.png" });

    await browser.close();
  } catch (e) {
    console.error(`Received error durring Puppeteer process: ${e}`);
  }
};
