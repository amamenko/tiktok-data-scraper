import React, { useEffect, useState } from "react";
import axios from "axios";
import { DailyLive } from "./interfaces/DailyLive.interface";
import { format, intervalToDuration } from "date-fns";
import { LiveRoom } from "./interfaces/LiveRoom.interface";
import { RoomCard } from "./components/Room/RoomCard";
import Select, { SingleValue } from "react-select";
import "./App.scss";

const App = () => {
  const [liveData, changeLiveData] = useState<DailyLive | null>(null);

  const options = [
    { value: "most_diamonds", label: "Most diamonds" },
    { value: "least_diamonds", label: "Least diamonds" },
    { value: "most_recently_updated", label: "Most recently updated" },
    { value: "least_recently_updated", label: "Least recently updated" },
    { value: "longest_duration", label: "Longest duration" },
    { value: "shortest_duration", label: "Shortest duration" },
  ];

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
        liveDataLivesArr.sort((a: LiveRoom, b: LiveRoom) =>
          a.updatedAt > b.updatedAt ? -1 : 1
        );
        liveDataObj.lives = liveDataLivesArr;
        changeLiveData(liveDataObj);
      }
    };
    fetchData();
  }, []);

  const handleSelectOptionChange = (
    option: SingleValue<{
      value: string;
      label: string;
    }>
  ) => {
    const newVal = option?.value || "";
    if (newVal) {
      const clonedLives = liveData ? [...liveData.lives] : [];
      const sortAllLives = (sortBy: string) => {
        clonedLives.sort((a: LiveRoom, b: LiveRoom) => {
          if (sortBy === "most_diamonds") {
            return a.diamonds > b.diamonds ? -1 : 1;
          } else if (sortBy === "least_diamonds") {
            return a.diamonds > b.diamonds ? 1 : -1;
          } else if (sortBy === "most_recently_updated") {
            return a.updatedAt > b.updatedAt ? -1 : 1;
          } else if (sortBy === "least_recently_updated") {
            return a.updatedAt > b.updatedAt ? 1 : -1;
          } else if (sortBy.includes("duration")) {
            const getDuration = (el: LiveRoom) => {
              const totalDuration = intervalToDuration({
                start: new Date(el.createdAt),
                end: new Date(el.updatedAt),
              });
              const hours = (totalDuration.hours || 0) * 3600;
              const minutes = (totalDuration.minutes || 0) * 60;
              const seconds = totalDuration.seconds || 0;
              return hours + minutes + seconds;
            };
            if (sortBy === "longest_duration") {
              return getDuration(a) > getDuration(b) ? -1 : 1;
            } else {
              if (sortBy === "shortest_duration") {
                return getDuration(a) > getDuration(b) ? 1 : -1;
              }
              return 0;
            }
          } else {
            return 0;
          }
        });
        const newLiveObj = {
          ...liveData,
          lives: clonedLives,
        } as unknown as DailyLive;
        return newLiveObj;
      };
      if (
        newVal === "most_diamonds" ||
        newVal === "least_diamonds" ||
        newVal === "most_recently_updated" ||
        newVal === "least_recently_updated" ||
        newVal === "longest_duration" ||
        newVal === "shortest_duration"
      ) {
        const newLiveObj = sortAllLives(newVal);
        changeLiveData(newLiveObj);
      }
    }
  };

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
            <div className="rooms_sort_container">
              <p>Sort by:</p>
              <Select
                className="sort_select_container"
                options={options}
                onChange={(newValue) => handleSelectOptionChange(newValue)}
                defaultValue={{
                  value: "most_recently_updated",
                  label: "Most recently updated",
                }}
                isSearchable={false}
              />
            </div>
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
                    <RoomCard
                      live={live}
                      totalDuration={totalDuration}
                      index={i}
                    />
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
