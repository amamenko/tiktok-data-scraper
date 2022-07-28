import { addMinutes, format } from "date-fns";
import { useContext, useState } from "react";
import { AppContext } from "../../App";
import { FaMoon, FaRegMoon } from "react-icons/fa";
import DatePicker from "react-datepicker";
import axios from "axios";
import { LiveRoom } from "../../interfaces/LiveRoom.interface";
import "react-datepicker/dist/react-datepicker.css";
import "./Header.scss";

export const Header = () => {
  const {
    changeDataLoading,
    liveData,
    changeLiveData,
    darkMode,
    changeDarkMode,
  } = useContext(AppContext);
  const maxDate = addMinutes(new Date(), new Date().getTimezoneOffset());
  const [startDate, setStartDate] = useState(maxDate);
  const [datePickerOpen, changeDatePickerOpen] = useState(false);
  const sumDiamonds = liveData
    ? liveData.lives.reduce((a, b) => a + b.diamonds, 0)
    : 0;
  const totalRevenue = parseFloat((sumDiamonds * 0.005).toFixed(2));
  const agentsRevenue = Intl.NumberFormat(navigator.language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat((sumDiamonds * 0.0011).toFixed(2)));
  const toggleDarkMode = () => changeDarkMode(!darkMode);

  const handleDatePickerChange = async (date: Date) => {
    if (date.toISOString() !== startDate.toISOString()) {
      setStartDate(date);
      changeDataLoading(true);
      const nodeEnv = process.env.REACT_APP_NODE_ENV
        ? process.env.REACT_APP_NODE_ENV
        : "";
      const formattedDate = format(date, "MM/dd/yyyy");

      const liveArr = await axios
        .get(
          nodeEnv && nodeEnv === "production"
            ? `${process.env.REACT_APP_PROD_SERVER}/api/daily_live`
            : "http://localhost:4000/api/daily_live",
          { params: { date: formattedDate } }
        )
        .then((res) => res.data)
        .then((data) => {
          changeDataLoading(false);
          return data;
        })
        .catch((e) => {
          changeDataLoading(false);
          console.error(e);
        });
      if (liveArr) {
        const liveDataObj = liveArr;
        let liveDataLivesArr = liveDataObj.lives;
        liveDataLivesArr.sort((a: LiveRoom, b: LiveRoom) =>
          a.updatedAt > b.updatedAt ? -1 : 1
        );
        liveDataObj.lives = liveDataLivesArr;
        changeLiveData(liveDataObj);
      }
    }
  };

  const toggleDatePickerOpen = () => {
    changeDatePickerOpen(!datePickerOpen);
  };

  return (
    <div className="app_header">
      <div className="header_stats_outer_container">
        <div className="header_stats_container title">
          <div className={`date_title ${darkMode ? "dark" : ""}`}>
            <DatePicker
              open={datePickerOpen}
              selected={startDate}
              onChange={handleDatePickerChange}
              calendarClassName={`datepicker ${darkMode ? "dark" : ""}`}
              dayClassName={() => `datepicker_day ${darkMode ? "dark" : ""}`}
              onKeyDown={(e) => {
                e.preventDefault();
                return false;
              }}
              minDate={new Date(2022, 6, 19)}
              maxDate={maxDate}
              shouldCloseOnSelect={true}
              readOnly={true}
              onInputClick={toggleDatePickerOpen}
              onSelect={toggleDatePickerOpen}
              onClickOutside={toggleDatePickerOpen}
            />
          </div>
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
            Agent 11%:
            <br />
            <span>${agentsRevenue.toLocaleString()}</span>
          </h2>
        </div>
        <div className={`header_stats_container ${darkMode ? "dark" : ""}`}>
          <h2>
            Total rooms: <br />
            <span>{liveData ? liveData.lives.length : 0}</span>
          </h2>
        </div>
      </div>
      <h2 className={`stats_last_updated ${darkMode ? "dark" : ""}`}>
        Last updated:{" "}
        {liveData ? format(new Date(liveData.updatedAt), "PPpp") : "N/A"}
      </h2>
    </div>
  );
};
