import { useContext } from "react";
import Select from "react-select";
import { handleSelectOptionChange } from "../../functions/handleSelectOptionChange";
import { DailyLive } from "../../interfaces/DailyLive.interface";
import { ThemeContext } from "../Providers/Theme/ThemeProvider";
import "./SortDropdown.scss";

export const SortDropdown = ({
  liveData,
  changeLiveData,
}: {
  liveData: DailyLive;
  changeLiveData: React.Dispatch<React.SetStateAction<DailyLive | null>>;
}) => {
  const { darkMode } = useContext(ThemeContext);
  const options = [
    { value: "most_diamonds", label: "Most diamonds" },
    { value: "least_diamonds", label: "Least diamonds" },
    { value: "most_recently_updated", label: "Most recently updated" },
    { value: "least_recently_updated", label: "Least recently updated" },
    { value: "longest_duration", label: "Longest duration" },
    { value: "shortest_duration", label: "Shortest duration" },
  ];
  return (
    <div className={`rooms_sort_container ${darkMode ? "dark" : ""}`}>
      <p>Sort by:</p>
      <Select
        className={`sort_select_container ${darkMode ? "dark" : ""}`}
        classNamePrefix={`sort_select${darkMode ? "_dark" : ""}`}
        options={options}
        onChange={(newValue) =>
          handleSelectOptionChange(newValue, liveData, changeLiveData)
        }
        defaultValue={{
          value: "most_recently_updated",
          label: "Most recently updated",
        }}
        isSearchable={false}
      />
    </div>
  );
};
