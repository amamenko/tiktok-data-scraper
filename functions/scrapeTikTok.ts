import "dotenv/config";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { exec } from "child_process";
import { HTTPRequest, Page } from "puppeteer";
import { format, subDays } from "date-fns";
import { DailyLive } from "../models/DailyLive";
import { Live } from "../interfaces/live.interface";

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
    page.on("requestfinished", async (request: HTTPRequest) => {
      const response = request.response();
      if (request.url().includes("get_live_anchor_list")) {
        const data = await response.json();
        if (data && data.data && data.data.inLiveAmount) {
          // const totalLive = data.data.inLiveAmount;
          const individualInfos = data.data.liveAnchorInfos;
          if (
            individualInfos &&
            Array.isArray(individualInfos) &&
            individualInfos.every((el) => el.indicators)
          ) {
            const yesterday = format(subDays(new Date(), 1), "MM/dd/yyyy");
            const today = format(new Date(), "MM/dd/yyyy");
            const fullTimeDate = format(new Date(), "PPpp");
            const allLiveResults = individualInfos.map((el) => {
              const roomID = el.roomID;
              const user = el.anchorBaseInfo.user_base_info;
              const userDisplayID = user.display_id;
              const userID = user.user_id;
              const userAvatar = user.avatar;
              const totalDiamonds = el.indicators?.diamonds || 0;
              return {
                roomID,
                user: {
                  displayID: userDisplayID,
                  userID,
                  avatar: userAvatar,
                },
                diamonds: totalDiamonds,
              };
            });
            // First compare to yesterday's previous live data just in case to check for still streaming lives
            const yesterdayOldLiveData = await DailyLive.find({
              date: yesterday,
            }).catch((e) => console.error(e));
            const yesterdayLiveDataArr = yesterdayOldLiveData[0]?.lives;
            const yesterdayRoomIDs = yesterdayLiveDataArr
              ? yesterdayLiveDataArr.map((live: Live) => live.roomID)
              : [];
            // Compare to today's previous live data
            const oldLiveData = await DailyLive.find({
              date: today,
            }).catch((e) => console.error(e));
            const liveDataArr = oldLiveData[0]?.lives;
            const oldRoomIDs = liveDataArr.map((live: Live) => live.roomID);
            for (const live of allLiveResults) {
              const handleYesterdayMatch = () => {
                const foundYesterdayLive = yesterdayLiveDataArr.find(
                  (el: Live) => el.roomID === live.roomID
                );
                if (foundYesterdayLive) {
                  const newCurrentLive = {
                    ...live,
                    diamonds: live.diamonds - foundYesterdayLive.diamonds,
                  };
                  return newCurrentLive;
                }
                return;
              };
              if (!oldRoomIDs.includes(live.roomID)) {
                if (yesterdayRoomIDs.includes(live.roomID)) {
                  const newLiveObj = handleYesterdayMatch();
                  liveDataArr.push(newLiveObj);
                } else {
                  liveDataArr.push(live);
                }
              } else {
                const foundIndex = liveDataArr.findIndex(
                  (el: Live) => el.roomID === live.roomID
                );
                if (foundIndex >= 0) {
                  if (yesterdayRoomIDs.includes(live.roomID)) {
                    const newLiveObj = handleYesterdayMatch();
                    liveDataArr[foundIndex] = newLiveObj;
                  } else {
                    liveDataArr[foundIndex] = live;
                  }
                }
              }
            }
            const liveDateFilter = { date: today };
            const liveDataUpdate = { date: today, lives: liveDataArr };
            // Update last actor
            await DailyLive.findOneAndUpdate(liveDateFilter, liveDataUpdate);
            console.log(
              `Successfully updated ${today} lives at ${fullTimeDate}!`
            );
          }
        }
      }
    });

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

    await page.waitForTimeout(10000);

    await page.goto("https://live-backstage.tiktok.com/portal/anchor/live", {
      waitUntil: "networkidle2",
    });

    await page.waitForTimeout(10000);

    // Keep clicking next button until it is disabled to trigger all paginated requests
    const isElementVisible = async (page: Page, cssSelector: string) => {
      let visible = true;
      await page.waitForTimeout(5000);
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

    await page.screenshot({ path: "test1.png" });

    await browser.close();
  } catch (e) {
    console.error(`Received error durring Puppeteer process: ${e}`);
  }
};
