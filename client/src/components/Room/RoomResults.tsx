import React from "react";
import { intervalToDuration } from "date-fns";
import { DailyLive } from "../../interfaces/DailyLive.interface";
import { RoomCard } from "./RoomCard";

export const RoomResults = ({ liveData }: { liveData: DailyLive }) => {
  return (
    <>
      {liveData.lives.map((live, i) => {
        const totalDuration = intervalToDuration({
          start: new Date(live.createdAt),
          end: new Date(live.updatedAt),
        });
        return (
          <React.Fragment key={i}>
            <RoomCard live={live} totalDuration={totalDuration} index={i} />
          </React.Fragment>
        );
      })}
    </>
  );
};
