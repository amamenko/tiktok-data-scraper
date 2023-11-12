import { useContext } from "react";
import { FaMoon, FaRegMoon } from "react-icons/fa";
import { ThemeContext } from "../Providers/Theme/ThemeProvider";

export const DarkModeToggle = () => {
  const { darkMode, changeDarkMode } = useContext(ThemeContext);
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
        <FaMoon
          className="moon_icon"
          onClick={toggleDarkMode}
          size={20}
          color={"#000"}
        />
      )}
    </div>
  );
};
