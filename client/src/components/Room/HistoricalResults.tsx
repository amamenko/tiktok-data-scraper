import React, { useContext } from "react";
import { DailyLive } from "../../interfaces/DailyLive.interface";
import { AppContext } from "../../App";
import { DarkModeToggle } from "./DarkModeToggle";
import { LiveDataList } from "./LiveDataList";
import { PiCaretLeftBold } from "react-icons/pi";
import "./RoomCard.scss";
import { ClipLoader } from "react-spinners";

export const HistoricalResults = ({
  historicalData,
}: {
  historicalData: DailyLive | null;
}) => {
  const {
    dataLoading,
    darkMode,
    showRankingHistory,
    changeShowRankingHistory,
  } = useContext(AppContext);
  const handleToggleRankingHistory = () =>
    changeShowRankingHistory(!showRankingHistory);
  return (
    <div className={`rooms_container ${darkMode ? "dark" : ""}`}>
      <span className="back_header_button" onClick={handleToggleRankingHistory}>
        <PiCaretLeftBold size={25} />
      </span>
      <DarkModeToggle />
      <h2 className="rankings_title">Ranking history</h2>
      {dataLoading && !historicalData ? (
        <div className="loader_container">
          <ClipLoader
            color={darkMode ? "#fff" : "#000"}
            loading={true}
            size={100}
          />
        </div>
      ) : historicalData ? (
        <LiveDataList liveData={historicalData} />
      ) : (
        <></>
      )}
    </div>
  );
};
