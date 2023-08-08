import React from "react";
import { DailyLive } from "../../interfaces/DailyLive.interface";
import { LeaderCard } from "./LeaderCard";
import { RoomCard } from "./RoomCard";

interface LiveDataListProps {
  liveData: DailyLive;
}

export const LiveDataList = ({ liveData }: LiveDataListProps) => {
  return (
    <>
      <div className="leader-cards-wrapper">
        {liveData.lives.slice(0, 3).map((live, i) => {
          return (
            <React.Fragment key={i}>
              <LeaderCard
                live={live}
                index={i}
                resultsUpdated={liveData.updatedAt}
              />
            </React.Fragment>
          );
        })}
      </div>
      {liveData.lives.slice(3).map((live, i) => {
        return (
          <React.Fragment key={i}>
            <RoomCard
              live={live}
              index={i}
              resultsUpdated={liveData.updatedAt}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};
