import { HTTPRequest } from "puppeteer";
import { format, subDays } from "date-fns";
import { DailyLive } from "../models/DailyLive";
import { Live } from "../interfaces/live.interface";
import { User } from "../models/User";
import { logger } from "../logger/logger";

export const handleRequestFinished = async (
  request: HTTPRequest,
  previouslyModifiedLives: number
) => {
  try {
    const response = request.response();
    if (request.url().includes("get_live_anchor_list")) {
      const data = await response.json();
      const totalLives = data?.data?.inLiveAmount || 0;
      if (data && data.data && data.data.inLiveAmount) {
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
          const updatedLivesNumber =
            previouslyModifiedLives + allLiveResults.length;
          // First compare to yesterday's previous live data just in case to check for still streaming lives
          const yesterdayOldLiveData = await DailyLive.find({
            date: yesterday,
          }).catch((e) => {
            if (process.env.NODE_ENV === "production") {
              logger("server").error(e);
            } else {
              console.error(e);
            }
          });
          const yesterdayLiveDataArr: Live[] = yesterdayOldLiveData[0]
            ? yesterdayOldLiveData[0].lives
            : [];
          const yesterdayRoomIDs = yesterdayLiveDataArr.map(
            (live: Live) => live.roomID
          );

          // Compare to today's previous live data
          const oldLiveData = await DailyLive.find({
            date: today,
          }).catch((e) => {
            if (process.env.NODE_ENV === "production") {
              logger("server").error(e);
            } else {
              console.error(e);
            }
          });
          if (!oldLiveData[0]) {
            // Current date live document doesn't exist - create one
            await DailyLive.create({
              date: today,
              paths: [],
            }).catch((e) => {
              if (process.env.NODE_ENV === "production") {
                logger("server").error(e);
              } else {
                console.error(e);
              }
            });
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
              (e) => {
                if (process.env.NODE_ENV === "production") {
                  logger("server").error(e);
                } else {
                  console.error(e);
                }
              }
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
              await User.create(live.user).catch((e) => {
                if (process.env.NODE_ENV === "production") {
                  logger("server").error(e);
                } else {
                  console.error(e);
                }
              });
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
          const liveDataUpdate = {
            date: today,
            lives: liveDataArr,
          };
          // Update live data
          await DailyLive.findOneAndUpdate(liveDateFilter, liveDataUpdate);
          const successStatement = `Successfully updated ${
            updatedLivesNumber - allLiveResults.length + 1
          }-${updatedLivesNumber} out of ${totalLives} lives at ${fullTimeDate}!`;
          if (process.env.NODE_ENV === "production") {
            logger("server").info(successStatement);
          } else {
            console.log(successStatement);
          }
          return allLiveResults.length;
        }
      }
    }
  } catch (e) {
    if (process.env.NODE_ENV === "production") {
      logger("server").error(e);
    } else {
      console.error(e);
    }
    return previouslyModifiedLives;
  }
};
