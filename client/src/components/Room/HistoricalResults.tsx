import React, { useContext } from "react";
import { DailyLive } from "../../interfaces/DailyLive.interface";
import { AppContext } from "../../App";
import { DarkModeToggle } from "./DarkModeToggle";
import { LiveDataList } from "./LiveDataList";
import { PiCaretLeftBold } from "react-icons/pi";
import "./RoomCard.scss";

export const HistoricalResults = ({
  historicalData,
}: {
  historicalData: DailyLive | null;
}) => {
  const { darkMode, showRankingHistory, changeShowRankingHistory } =
    useContext(AppContext);
  const handleToggleRankingHistory = () =>
    changeShowRankingHistory(!showRankingHistory);
  return (
    <div className={`rooms_container ${darkMode ? "dark" : ""}`}>
      <span className="back_header_button" onClick={handleToggleRankingHistory}>
        <PiCaretLeftBold size={25} />
      </span>
      <DarkModeToggle />
      <h2 className="rankings_title">Ranking history</h2>
      {historicalData && <LiveDataList liveData={historicalData} />}
    </div>
  );
};
