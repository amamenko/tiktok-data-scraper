import React, { useContext } from "react";
import { DailyLive } from "../../interfaces/DailyLive.interface";
import { AppContext } from "../../App";
import { Tooltip } from "react-tooltip";
import { HeaderUpdateInformation } from "../Header/HeaderUpdateInformation";
import { DarkModeToggle } from "./DarkModeToggle";
import { LiveDataList } from "./LiveDataList";
import { RefreshResultsToggle } from "./RefreshResultsToggle";
import "./RoomCard.scss";
import "react-tooltip/dist/react-tooltip.css";

export const RoomResults = ({ liveData }: { liveData: DailyLive }) => {
  const { darkMode } = useContext(AppContext);
  return (
    <div className={`rooms_container ${darkMode ? "dark" : ""}`}>
      <DarkModeToggle />
      <RefreshResultsToggle />
      <h2 className="rankings_title">Weekly Rankings</h2>
      <HeaderUpdateInformation liveData={liveData} />
      <LiveDataList liveData={liveData} />
      <Tooltip
        className={`${darkMode ? "dark" : ""}`}
        id="diamond-info-tooltip"
      />
    </div>
  );
};
