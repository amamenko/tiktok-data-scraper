import { useContext } from "react";
import { AppContext } from "../../App";
import { IoRefresh } from "react-icons/io5";

export const RefreshResultsToggle = () => {
  const { darkMode, changeRefreshTriggered } = useContext(AppContext);
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
        <IoRefresh className="refresh_icon" onClick={toggleRefresh} size={25} />
      )}
    </div>
  );
};
