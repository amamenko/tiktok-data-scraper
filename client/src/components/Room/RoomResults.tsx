import React, { useContext } from "react";
import { DailyLive } from "../../interfaces/DailyLive.interface";
import { RoomCard } from "./RoomCard";
import { LeaderCard } from "./LeaderCard";
import { AppContext } from "../../App";
import { RefreshCountdownTimer } from "./RefreshCountdownTimer";
import { FaMoon, FaRegMoon } from "react-icons/fa";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { formatDistance } from "date-fns";
import { Tooltip } from "react-tooltip";
import "./RoomCard.scss";
import "react-tooltip/dist/react-tooltip.css";

export const RoomResults = ({ liveData }: { liveData: DailyLive }) => {
  const { darkMode, changeDarkMode } = useContext(AppContext);
  const toggleDarkMode = () => changeDarkMode(!darkMode);
  return (
    <div className={`rooms_container ${darkMode ? "dark" : ""}`}>
      <div className="toggle_dark_mode_button">
        {darkMode ? (
          <FaRegMoon
            className="moon_icon"
            onClick={toggleDarkMode}
            size={20}
            color={"#fff"}
          />
        ) : (
          <FaMoon className="moon_icon" onClick={toggleDarkMode} size={20} />
        )}
      </div>
      <h2 className="rankings_title">Weekly Rankings</h2>
      <div className="countdown_container">
        {liveData.updatedAt && (
          <span className="information_line">
            Last update{" "}
            {formatDistance(new Date(liveData.updatedAt), new Date(), {
              addSuffix: true,
            })}{" "}
            <AiOutlineQuestionCircle
              data-tooltip-id="diamond-info-tooltip"
              data-tooltip-content="Diamond count is updated every 10 minutes"
              className="info_circle"
              size={15}
              color={"rgb(149, 148, 154)"}
            />
          </span>
        )}
        <span className="information_line">
          Restart in <RefreshCountdownTimer />
        </span>
      </div>
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
      <Tooltip
        className={`${darkMode ? "dark" : ""}`}
        id="diamond-info-tooltip"
      />
    </div>
  );
};
