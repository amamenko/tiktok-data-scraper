import React, { useEffect, useState } from "react";
import axios from "axios";
import { DailyLive } from "./interfaces/DailyLive.interface";
import { format, intervalToDuration } from "date-fns";
import { LiveRoom } from "./interfaces/LiveRoom.interface";
import "./App.scss";

const App = () => {
  const [liveData, changeLiveData] = useState<DailyLive | null>(null);

  const getDailyLiveData = async () => {
    const nodeEnv = process.env.REACT_APP_NODE_ENV
      ? process.env.REACT_APP_NODE_ENV
      : "";

    const liveArr = await axios
      .get(
        nodeEnv && nodeEnv === "production"
          ? `${process.env.REACT_APP_PROD_SERVER}/api/daily_live`
          : "http://localhost:4000/api/daily_live"
      )
      .then((res) => res.data)
      .then((data) => data)
      .catch((e) => console.error(e));
    return liveArr;
  };

  useEffect(() => {
    const fetchData = async () => {
      const liveData = await getDailyLiveData();
      if (liveData) {
        const liveDataObj = liveData;
        let liveDataLivesArr = liveDataObj.lives;
        liveDataLivesArr = liveDataLivesArr.filter(
          (live: LiveRoom) => live.createdAt !== live.updatedAt
        );
        liveDataObj.lives = liveDataLivesArr;
        changeLiveData(liveDataObj);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      {liveData && liveData.lives ? (
        <>
          <h2>
            Total diamonds: {liveData.lives.reduce((a, b) => a + b.diamonds, 0)}
          </h2>
          <h2>Total lives today: {liveData.lives.length}</h2>
          <h2>Last updated: {format(new Date(liveData.updatedAt), "PPpp")}</h2>
          {liveData.lives.map((live, i) => {
            const totalDuration = intervalToDuration({
              start: new Date(live.createdAt),
              end: new Date(live.updatedAt),
            });
            const hours = totalDuration.hours;
            const minutes = totalDuration.minutes;
            const seconds = totalDuration.seconds;
            if (hours === 0 && minutes === 0 && seconds === 0) {
              return <></>;
            } else {
              return (
                <div key={i}>
                  <p>Diamonds: {live.diamonds}</p>
                  <p>Started: {format(new Date(live.createdAt), "PPpp")}</p>
                  <p>Updated: {format(new Date(live.updatedAt), "PPpp")}</p>
                  <p>
                    Total duration: {hours ? `${hours} hours ` : ""}
                    {minutes ? `${minutes} minutes ` : ""}
                    {seconds ? `${seconds} seconds` : ""}
                  </p>
                </div>
              );
            }
          })}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default App;
