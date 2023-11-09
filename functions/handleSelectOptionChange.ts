import { intervalToDuration } from "date-fns";
import { SingleValue } from "react-select";
import { DailyLive } from "../interfaces/DailyLive.interface";
import { LiveRoom } from "../interfaces/LiveRoom.interface";

export const handleSelectOptionChange = (
  option: SingleValue<{
    value: string;
    label: string;
  }>,
  liveData: DailyLive,
  changeLiveData: React.Dispatch<React.SetStateAction<DailyLive | null>>
) => {
  const newVal = option?.value || "";
  if (newVal) {
    const clonedLives = liveData ? [...liveData.lives] : [];
    const sortAllLives = (sortBy: string) => {
      clonedLives.sort((a: LiveRoom, b: LiveRoom) => {
        if (sortBy === "most_diamonds") {
          return a.diamonds > b.diamonds ? -1 : 1;
        } else if (sortBy === "least_diamonds") {
          return a.diamonds > b.diamonds ? 1 : -1;
        } else if (sortBy === "most_recently_updated") {
          return a.updatedAt > b.updatedAt ? -1 : 1;
        } else if (sortBy === "least_recently_updated") {
          return a.updatedAt > b.updatedAt ? 1 : -1;
        } else if (sortBy.includes("duration")) {
          const getDuration = (el: LiveRoom) => {
            const totalDuration = intervalToDuration({
              start: new Date(el.createdAt),
              end: new Date(el.updatedAt),
            });
            const hours = (totalDuration.hours || 0) * 3600;
            const minutes = (totalDuration.minutes || 0) * 60;
            const seconds = totalDuration.seconds || 0;
            return hours + minutes + seconds;
          };
          if (sortBy === "longest_duration") {
            return getDuration(a) > getDuration(b) ? -1 : 1;
          } else {
            if (sortBy === "shortest_duration") {
              return getDuration(a) > getDuration(b) ? 1 : -1;
            }
            return 0;
          }
        } else {
          return 0;
        }
      });
      const newLiveObj = {
        ...liveData,
        lives: clonedLives,
      } as unknown as DailyLive;
      return newLiveObj;
    };
    if (
      newVal === "most_diamonds" ||
      newVal === "least_diamonds" ||
      newVal === "most_recently_updated" ||
      newVal === "least_recently_updated" ||
      newVal === "longest_duration" ||
      newVal === "shortest_duration"
    ) {
      const newLiveObj = sortAllLives(newVal);
      changeLiveData(newLiveObj);
    }
  }
};
