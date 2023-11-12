import { useContext } from "react";
import { ThemeContext } from "../Providers/Theme/ThemeProvider";

export const HeaderSection = ({
  title,
  data,
}: {
  title: string;
  data: string;
}) => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`header_stats_container ${darkMode ? "dark" : ""}`}>
      <h2>
        {title}
        <br />
        <span>{data}</span>
      </h2>
    </div>
  );
};
