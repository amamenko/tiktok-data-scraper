"use client";
import React, { KeyboardEvent, useContext, useState } from "react";
import DatePicker from "react-datepicker";
import { AppContext } from "../App/App";
import axios from "axios";
import { addMinutes, format } from "date-fns";
import { LiveRoom } from "../../interfaces/LiveRoom.interface";
import { ThemeContext } from "../Providers/Theme/ThemeProvider";

export const SelectDate = () => {
  const { changeDataLoading, changeLiveData } = useContext(AppContext);
  const { darkMode } = useContext(ThemeContext);
  const maxDate = addMinutes(new Date(), new Date().getTimezoneOffset());
  const [startDate, setStartDate] = useState(maxDate);
  const [datePickerOpen, changeDatePickerOpen] = useState(false);
  const handleDatePickerChange = async (date: Date) => {
    if (date.toISOString() !== startDate.toISOString()) {
      setStartDate(date);
      changeDataLoading(true);
      const nodeEnv = process.env.REACT_APP_NODE_ENV
        ? process.env.REACT_APP_NODE_ENV
        : "";
      const formattedDate = format(date, "MM/dd/yyyy");
      if (formattedDate) {
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
    }
  };
  const toggleDatePickerOpen = () => {
    changeDatePickerOpen(!datePickerOpen);
  };
  return (
    <div className={`date_title ${darkMode ? "dark" : ""}`}>
      <DatePicker
        open={datePickerOpen}
        selected={startDate}
        onChange={handleDatePickerChange}
        calendarClassName={`datepicker ${darkMode ? "dark" : ""}`}
        dayClassName={() => `datepicker_day ${darkMode ? "dark" : ""}`}
        onKeyDown={(e: KeyboardEvent) => {
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
  );
};
