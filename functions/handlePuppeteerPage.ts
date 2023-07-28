import { Browser, HTTPRequest, Page } from "puppeteer";
import { waitForTimeout } from "./waitForTimeout";
import { handleRequestFinished } from "./handleRequestFinished";
import { logger } from "../logger/logger";

export const handlePuppeteerPage = async (browser: Browser) => {
  try {
    const page = await browser.newPage();

    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    // Configure the navigation timeout
    page.setDefaultNavigationTimeout(0);

    let totalUpdatedLives = 0;

    page.on("requestfinished", async (request: HTTPRequest) => {
      const modifiedLives = await handleRequestFinished(
        request,
        totalUpdatedLives
      );
      if (modifiedLives) totalUpdatedLives += modifiedLives;
    });

    await page.goto("https://live-backstage.tiktok.com/login?loginType=email", {
      waitUntil: "networkidle2",
    });

    await waitForTimeout(5000);

    try {
      await page.click("button.semi-button-secondary");
    } catch (e) {
      if (process.env.NODE_ENV === "production") {
        logger("server").error("No log in button found!");
      } else {
        console.error("No log in button found!");
      }
    }

    await page.focus('input[placeholder="Enter email address"]');
    await page.keyboard.type(process.env.TIK_TOK_EMAIL);
    await page.focus('input[placeholder="Enter password"]');
    await page.keyboard.type(process.env.TIK_TOK_PASSWORD);
    try {
      await page.click("button.semi-button-tertiary.semi-button-size-large");
    } catch (e) {
      if (process.env.NODE_ENV === "production") {
        logger("server").error("No log in button found!");
      } else {
        console.error("No log in button found!");
      }
    }

    await waitForTimeout(10000);

    await page.goto("https://live-backstage.tiktok.com/portal/anchor/live", {
      waitUntil: "networkidle2",
    });

    await waitForTimeout(10000);

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
      await page.click(cssSelector).catch(() => {});
      loadMoreVisible = await isElementVisible(page, cssSelector);
    }
  } catch (e) {
    if (process.env.NODE_ENV === "production") {
      logger("server").error(`Received error during Puppeteer process: ${e}`);
    } else {
      console.error(`Received error during Puppeteer process: ${e}`);
    }
  } finally {
    // ALWAYS make sure Puppeteer closes the browser when finished regardless of success or error
    await browser.close();
    if (process.env.NODE_ENV === "production") {
      logger("server").info("Scraping complete. Browser closed.");
    } else {
      console.log("Scraping complete. Browser closed.");
    }
  }
};
