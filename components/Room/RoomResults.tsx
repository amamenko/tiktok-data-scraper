import React, { useContext } from "react";
import { DailyLive } from "../../interfaces/DailyLive.interface";
import { Tooltip } from "react-tooltip";
import { HeaderUpdateInformation } from "../Header/HeaderUpdateInformation";
import { DarkModeToggle } from "./DarkModeToggle";
import { LiveDataList } from "./LiveDataList";
import { RefreshResultsToggle } from "./RefreshResultsToggle";
import { ThemeContext } from "../Providers/Theme/ThemeProvider";
import { endOfWeek, format } from "date-fns";
import "./RoomCard.scss";
import "react-tooltip/dist/react-tooltip.css";

export const RoomResults = ({ liveData }: { liveData: DailyLive }) => {
  const { darkMode } = useContext(ThemeContext);
  const lastDayOfWeek = format(
    endOfWeek(new Date(liveData.weekStarting)),
    "MM/dd/yyyy"
  );
  return (
    <div className={`rooms_container ${darkMode ? "dark" : ""}`}>
      <DarkModeToggle />
      <RefreshResultsToggle />
      <h2 className="rankings_title">Weekly Rankings</h2>
      <div className={`current_week_date_range ${darkMode ? "dark" : ""}`}>
        <span>{liveData.weekStarting}</span>
        <span>- {lastDayOfWeek}</span>
      </div>
      <HeaderUpdateInformation liveData={liveData} />
      <LiveDataList liveData={liveData} />
      <Tooltip
        className={`${darkMode ? "dark" : ""}`}
        id="diamond-info-tooltip"
      />
    </div>
  );
};
