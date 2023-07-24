import "dotenv/config";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { exec } from "child_process";
import { HTTPRequest, Page } from "puppeteer";
import { format, subDays } from "date-fns";
import { DailyLive } from "../models/DailyLive";
import { Live } from "../interfaces/live.interface";
import { User } from "../models/User";
import { executablePath } from "puppeteer";
import { waitForTimeout } from "./waitForTimeout";

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
      try {
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
              const yesterdayLiveDataArr: Live[] = yesterdayOldLiveData[0]
                ? yesterdayOldLiveData[0].lives
                : [];
              const yesterdayRoomIDs = yesterdayLiveDataArr.map(
                (live: Live) => live.roomID
              );

              // Compare to today's previous live data
              const oldLiveData = await DailyLive.find({
                date: today,
              }).catch((e) => console.error(e));
              if (!oldLiveData[0]) {
                // Current date live document doesn't exist - create one
                await DailyLive.create({
                  date: today,
                  diamondTrends: [],
                  paths: [],
                }).catch((e) => console.error(e));
              }
              const liveDataArr: Live[] = oldLiveData[0]
                ? oldLiveData[0].lives
                : [];
              const oldRoomIDs = liveDataArr.map((live: Live) => live.roomID);
              for (const live of allLiveResults) {
                const matchingUserFilter = {
                  userID: live.user.userID,
                };
                const matchingUser = await User.find(matchingUserFilter).catch(
                  (e) => console.error(e)
                );
                if (matchingUser[0]) {
                  // User already exists in DB
                  const { displayID, userID, avatar } = matchingUser[0];
                  if (
                    displayID !== live.user.displayID ||
                    userID !== live.user.userID ||
                    avatar !== live.user.avatar
                  ) {
                    // User in DB contains outdated data - update user
                    await User.findOneAndUpdate(matchingUserFilter, live.user);
                  }
                } else {
                  // User doesn't exist in DB - add new user
                  await User.create(live.user).catch((e) => console.error(e));
                }

                const handleYesterdayMatch = () => {
                  const foundYesterdayLive = yesterdayLiveDataArr.find(
                    (el: Live) => el.roomID === live.roomID
                  );
                  if (foundYesterdayLive) {
                    const newCurrentLive = {
                      roomID: live.roomID,
                      userID: live.user.userID,
                      diamonds:
                        live.diamonds - Number(foundYesterdayLive.diamonds) >= 0
                          ? live.diamonds - Number(foundYesterdayLive.diamonds)
                          : 0,
                      updatedAt: new Date(),
                      createdAt: new Date(),
                    };
                    return newCurrentLive;
                  }
                  return;
                };
                if (!oldRoomIDs.includes(live.roomID)) {
                  // This live did not start today
                  if (yesterdayRoomIDs.includes(live.roomID)) {
                    // Live started yesterday
                    const newLiveObj = handleYesterdayMatch();
                    liveDataArr.push(newLiveObj);
                  } else {
                    // This is a new live
                    const modifiedLive = {
                      roomID: live.roomID,
                      userID: live.user.userID,
                      diamonds: live.diamonds,
                      updatedAt: new Date(),
                      createdAt: new Date(),
                    };
                    liveDataArr.push(modifiedLive);
                  }
                } else {
                  const foundIndex = liveDataArr.findIndex(
                    (el: Live) => el.roomID === live.roomID
                  );
                  if (foundIndex >= 0) {
                    if (yesterdayRoomIDs.includes(live.roomID)) {
                      // Live started yesterday
                      const newLiveObj = handleYesterdayMatch();
                      liveDataArr[foundIndex] = newLiveObj;
                    } else {
                      const oldObj = liveDataArr[foundIndex];
                      // Update known live
                      const modifiedLive = {
                        roomID: live.roomID,
                        userID: live.user.userID,
                        diamonds: live.diamonds,
                        updatedAt: new Date(),
                        createdAt: oldObj.createdAt,
                      };
                      liveDataArr[foundIndex] = modifiedLive;
                    }
                  }
                }
              }
              const liveDateFilter = { date: today };
              const diamondTrends = oldLiveData[0]
                ? oldLiveData[0].diamondTrends
                : [];
              const currentHourIndex = new Date().getHours();
              if (!diamondTrends[currentHourIndex]) {
                diamondTrends[currentHourIndex] = liveDataArr.reduce(
                  (a, b: Live) => a + Number(b.diamonds),
                  0
                );
              }
              const liveDataUpdate = {
                date: today,
                diamondTrends,
                lives: liveDataArr,
              };
              // Update live data
              await DailyLive.findOneAndUpdate(liveDateFilter, liveDataUpdate);
              console.log(
                `Successfully updated ${today} lives at ${fullTimeDate}!`
              );
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    });

    await page.goto("https://live-backstage.tiktok.com/login?loginType=email", {
      waitUntil: "domcontentloaded",
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
      waitUntil: "domcontentloaded",
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
    console.error(`Received error durring Puppeteer process: ${e}`);
  } finally {
    // ALWAYS make sure Puppeteer closes the browser when finished - error or
    await browser.close();
  }
};
