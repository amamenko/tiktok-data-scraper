import React, { useEffect, useState } from "react";
import axios from "axios";
import { DailyLive } from "./interfaces/DailyLive.interface";
import { format, intervalToDuration } from "date-fns";
import { LiveRoom } from "./interfaces/LiveRoom.interface";
import { RoomCard } from "./components/Room/RoomCard";
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
          <div className="app_header">
            <div className="header_stats_outer_container">
              <div className="header_stats_container title">
                <h2 className="date_title">{liveData.date}</h2>
              </div>
            </div>
            <div className="header_stats_outer_container">
              <div className="header_stats_container">
                <h2>
                  Total diamonds:
                  <br />
                  <span>
                    {liveData.lives.reduce((a, b) => a + b.diamonds, 0)}
                  </span>
                </h2>
              </div>
              <div className="header_stats_container">
                <h2>
                  Total rooms: <br />
                  <span>{liveData.lives.length}</span>
                </h2>
              </div>
            </div>
            <h2 className="stats_last_updated">
              Last updated: {format(new Date(liveData.updatedAt), "PPpp")}
            </h2>
          </div>
          <div className="rooms_container">
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
                  <React.Fragment key={i}>
                    <RoomCard live={live} totalDuration={totalDuration} />
                  </React.Fragment>
                );
              }
            })}
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default App;
