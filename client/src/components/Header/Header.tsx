import { format } from "date-fns";
import { useContext } from "react";
import { AppContext } from "../../App";
import { FaMoon, FaRegMoon } from "react-icons/fa";
import { SelectDate } from "./SelectDate";
import { HeaderSection } from "./HeaderSection";
import "react-datepicker/dist/react-datepicker.css";
import "./Header.scss";

export const Header = () => {
  const { liveData, darkMode, changeDarkMode } = useContext(AppContext);
  const sumDiamonds = liveData
    ? liveData.lives.reduce((a, b) => a + b.diamonds, 0)
    : 0;
  const totalRevenue = parseFloat((sumDiamonds * 0.005).toFixed(2));
  const agentsRevenue = Intl.NumberFormat(navigator.language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat((sumDiamonds * 0.0011).toFixed(2)));
  const toggleDarkMode = () => changeDarkMode(!darkMode);
  return (
    <div className="app_header">
      <div className="header_stats_outer_container">
        <div className="header_stats_container title">
          <SelectDate />
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
        <HeaderSection
          title={"Total Diamonds:"}
          data={sumDiamonds.toLocaleString()}
        />
        <HeaderSection
          title={"Total Revenue:"}
          data={`$${totalRevenue.toLocaleString()}`}
        />
        <HeaderSection
          title={"Agent 11%:"}
          data={`$${agentsRevenue.toLocaleString()}`}
        />
        <HeaderSection
          title={"Total rooms:"}
          data={liveData ? liveData.lives.length.toString() : "0"}
        />
      </div>
      <h2 className={`stats_last_updated ${darkMode ? "dark" : ""}`}>
        Last updated:{" "}
        {liveData ? format(new Date(liveData.updatedAt), "PPpp") : "N/A"}
      </h2>
    </div>
  );
};
