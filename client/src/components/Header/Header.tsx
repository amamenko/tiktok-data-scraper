import { format } from "date-fns";
import { useContext } from "react";
import { AppContext } from "../../App";
import { DailyLive } from "../../interfaces/DailyLive.interface";
import { FaMoon, FaRegMoon } from "react-icons/fa";
import "./Header.scss";

export const Header = ({ liveData }: { liveData: DailyLive }) => {
  const { darkMode, changeDarkMode } = useContext(AppContext);
  const sumDiamonds = liveData.lives.reduce((a, b) => a + b.diamonds, 0);
  const totalRevenue = parseFloat((sumDiamonds * 0.005).toFixed(2));
  const toggleDarkMode = () => changeDarkMode(!darkMode);
  return (
    <div className="app_header">
      <div className="header_stats_outer_container">
        <div className="header_stats_container title">
          <h2 className={`date_title ${darkMode ? "dark" : ""}`}>
            {liveData.date}
          </h2>
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
      </div>
      <div className="header_stats_outer_container">
        <div className={`header_stats_container ${darkMode ? "dark" : ""}`}>
          <h2>
            Total diamonds:
            <br />
            <span>{sumDiamonds.toLocaleString()}</span>
          </h2>
        </div>
        <div className={`header_stats_container ${darkMode ? "dark" : ""}`}>
          <h2>
            Total revenue:
            <br />
            <span>${totalRevenue.toLocaleString()}</span>
          </h2>
        </div>
        <div className={`header_stats_container ${darkMode ? "dark" : ""}`}>
          <h2>
            Total rooms: <br />
            <span>{liveData.lives.length}</span>
          </h2>
        </div>
      </div>
      <h2 className={`stats_last_updated ${darkMode ? "dark" : ""}`}>
        Last updated: {format(new Date(liveData.updatedAt), "PPpp")}
      </h2>
    </div>
  );
};
