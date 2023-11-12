import { useContext } from "react";
import { AppContext } from "../App/App";
import { IoRefresh } from "react-icons/io5";
import { ThemeContext } from "../Providers/Theme/ThemeProvider";

export const RefreshResultsToggle = () => {
  const { changeRefreshTriggered } = useContext(AppContext);
  const { darkMode } = useContext(ThemeContext);
  const toggleRefresh = () => changeRefreshTriggered(true);
  return (
    <div className="toggle_refresh_button">
      {darkMode ? (
        <IoRefresh
          className="refresh_icon"
          onClick={toggleRefresh}
          size={25}
          color={"#fff"}
        />
      ) : (
        <IoRefresh
          className="refresh_icon"
          onClick={toggleRefresh}
          size={25}
          color="#000"
        />
      )}
    </div>
  );
};
