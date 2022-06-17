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

    await page.goto("https://live-backstage.tiktok.com", {
      waitUntil: "networkidle2",
    });

    await page.waitForTimeout(5000);

    await page.screenshot({ path: "test.png" });

    await page.waitForTimeout(5000);
  } catch (e) {
    console.error(`Received error durring Puppeteer process: ${e}`);
  }
};
