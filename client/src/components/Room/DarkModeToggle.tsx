import { useContext } from "react";
import { AppContext } from "../../App";
import { FaMoon, FaRegMoon } from "react-icons/fa";

export const DarkModeToggle = () => {
  const { darkMode, changeDarkMode } = useContext(AppContext);
  const toggleDarkMode = () => changeDarkMode(!darkMode);
  return (
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
  );
};
