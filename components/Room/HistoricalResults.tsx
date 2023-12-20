import React, { useContext } from "react";
import { DailyLive } from "../../interfaces/DailyLive.interface";
import { AppContext } from "../App/App";
import { DarkModeToggle } from "./DarkModeToggle";
import { LiveDataList } from "./LiveDataList";
import { PiCaretLeftBold } from "react-icons/pi";
import { ClipLoader } from "react-spinners";
import { ThemeContext } from "../Providers/Theme/ThemeProvider";
import { endOfWeek, format } from "date-fns";
import "./RoomCard.scss";

interface HistoricalResultsProps {
  historicalData: DailyLive | null;
}

export const HistoricalResults = ({
  historicalData,
}: HistoricalResultsProps) => {
  const { dataLoading, showRankingHistory, changeShowRankingHistory } =
    useContext(AppContext);
  const { darkMode } = useContext(ThemeContext);
  const handleToggleRankingHistory = () =>
    changeShowRankingHistory(!showRankingHistory);
  const lastDayOfWeek = historicalData?.weekStarting
    ? format(endOfWeek(new Date(historicalData?.weekStarting)), "MM/dd/yyyy")
    : undefined;
  return (
    <div className={`rooms_container ${darkMode ? "dark" : ""}`}>
      <span className="back_header_button" onClick={handleToggleRankingHistory}>
        <PiCaretLeftBold size={25} color={darkMode ? "#fff" : "#000"} />
      </span>
      <DarkModeToggle />
      <h2 className="rankings_title">Ranking History</h2>
      {historicalData?.weekStarting && lastDayOfWeek && (
        <div className={`current_week_date_range ${darkMode ? "dark" : ""}`}>
          <span>{historicalData?.weekStarting}</span>
          <span>- {lastDayOfWeek}</span>
        </div>
      )}
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
