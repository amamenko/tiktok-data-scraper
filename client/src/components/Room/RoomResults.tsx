import React from "react";
import { DailyLive } from "../../interfaces/DailyLive.interface";
import { RoomCard } from "./RoomCard";
import { LeaderCard } from "./LeaderCard";
import "./RoomCard.scss";

export const RoomResults = ({ liveData }: { liveData: DailyLive }) => {
  return (
    <>
      <h2 className="rankings_title">Daily Rankings</h2>
      <div className="leader-cards-wrapper">
        {liveData.lives.slice(0, 3).map((live, i) => {
          return (
            <React.Fragment key={i}>
              <LeaderCard live={live} index={i} />
            </React.Fragment>
          );
        })}
      </div>
      {liveData.lives.slice(3).map((live, i) => {
        return (
          <React.Fragment key={i}>
            <RoomCard live={live} index={i} />
          </React.Fragment>
        );
      })}
    </>
  );
};
