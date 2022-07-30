import { useContext } from "react";
import { AppContext } from "../../App";

export const HeaderSection = ({
  title,
  data,
}: {
  title: string;
  data: string;
}) => {
  const { darkMode } = useContext(AppContext);

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
