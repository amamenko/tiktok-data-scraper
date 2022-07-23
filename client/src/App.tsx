import React, { createContext, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { DailyLive } from "./interfaces/DailyLive.interface";
import { LiveRoom } from "./interfaces/LiveRoom.interface";
import { RoomResults } from "./components/Room/RoomResults";
import { Header } from "./components/Header/Header";
import { SortDropdown } from "./components/SortDropdown/SortDropdown";
import { ContextProps } from "./interfaces/ContextProps.interface";
import { contextDefaults } from "./contextDefaults";
import "./App.scss";

export const AppContext = createContext<ContextProps>(contextDefaults);

const App = () => {
  const [liveData, changeLiveData] = useState<DailyLive | null>(null);
  const [darkMode, changeDarkMode] = useState(true);

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

  // Look for color preference on app mount
  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      changeDarkMode(true);
    } else {
      changeDarkMode(false);
    }
  }, []);

  const handleLightChange = useCallback(
    (event: MediaQueryListEvent) => {
      if (event.matches) {
        if (!darkMode) changeDarkMode(true);
      } else {
        if (darkMode) changeDarkMode(false);
      }
    },
    [darkMode]
  );

  // Watch for light preference changes
  useEffect(() => {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", handleLightChange);
  }, [handleLightChange]);

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

  return (
    <AppContext.Provider
      value={{
        darkMode,
        changeDarkMode,
      }}
    >
      <div className="App">
        {liveData && liveData.lives ? (
          <>
            <Header liveData={liveData} />
            <div className="rooms_container">
              <SortDropdown
                liveData={liveData}
                changeLiveData={changeLiveData}
              />
              <RoomResults liveData={liveData} />
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </AppContext.Provider>
  );
};

export default App;
