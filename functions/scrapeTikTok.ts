import "dotenv/config";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { exec } from "child_process";
import { HTTPRequest, Page } from "puppeteer";
import { executablePath } from "puppeteer";
import { waitForTimeout } from "./waitForTimeout";
import { handleRequestFinished } from "./handleRequestFinished";

const stealth = StealthPlugin();
// Remove this specific stealth plugin from the default set
stealth.enabledEvasions.delete("user-agent-override");
puppeteer.use(stealth);

export const scrapeTikTok = async () => {
  console.log("Attempting to scrape Tik Tok data!");
  // Kill all leftover Puppeteer processes
  exec("pkill -9 -f puppeteer");

  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--no-zygote",
      "--ignore-certificate-errors",
    ],
    headless: "new",
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : executablePath(),
  });
  try {
    const page = await browser.newPage();

    // Configure the navigation timeout
    page.setDefaultNavigationTimeout(0);

    page.on("requestfinished", async (request: HTTPRequest) => {
      await handleRequestFinished(request);
    });

    await page.goto("https://live-backstage.tiktok.com/login?loginType=email", {
      waitUntil: "networkidle2",
    });

    await waitForTimeout(5000);

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

    await waitForTimeout(10000);

    await page.goto("https://live-backstage.tiktok.com/portal/anchor/live", {
      waitUntil: "networkidle2",
    });

    await waitForTimeout(10000);

    console.log("Successfully logged in!");

    // Keep clicking next button until it is disabled to trigger all paginated requests
    const isElementVisible = async (page: Page, cssSelector: string) => {
      let visible = true;
      await waitForTimeout(5000);
      await page
        .waitForSelector(cssSelector, { visible: true, timeout: 10000 })
        .catch(() => {
          visible = false;
        });
      return visible;
    };
    const cssSelector = "li:not(.semi-page-item-disabled).semi-page-next";
    let loadMoreVisible = await isElementVisible(page, cssSelector);
    while (loadMoreVisible) {
      console.log("Load more is visible! Loading more live data...");
      await page.click(cssSelector).catch(() => {});
      loadMoreVisible = await isElementVisible(page, cssSelector);
    }
  } catch (e) {
    console.error(`Received error during Puppeteer process: ${e}`);
  } finally {
    // ALWAYS make sure Puppeteer closes the browser when finished regardless of success or error
    await browser.close();
    console.log("Scraping complete. Browser closed.");
  }
};
