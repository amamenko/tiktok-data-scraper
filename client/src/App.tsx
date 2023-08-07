import React, { createContext, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { DailyLive } from "./interfaces/DailyLive.interface";
import { RoomResults } from "./components/Room/RoomResults";
import { ContextProps } from "./interfaces/ContextProps.interface";
import { contextDefaults } from "./contextDefaults";
import { ClipLoader } from "react-spinners";
import { HeaderLogo } from "./components/Header/HeaderLogo";
import { HistoricalResults } from "./components/Room/HistoricalResults";
import "./App.scss";

export const AppContext = createContext<ContextProps>(contextDefaults);

const App = () => {
  const [liveData, changeLiveData] = useState<DailyLive | null>(null);
  const [historicalData, changeHistoricalData] = useState<DailyLive | null>(
    null
  );

  const [showRankingHistory, changeShowRankingHistory] = useState(false);
  const [dataLoading, changeDataLoading] = useState(false);
  const [darkMode, changeDarkMode] = useState(true);

  const getLiveData = async (type?: string) => {
    const nodeEnv = process.env.REACT_APP_NODE_ENV
      ? process.env.REACT_APP_NODE_ENV
      : "";

    const liveArr = await axios
      .get(
        nodeEnv && nodeEnv === "production"
          ? `${process.env.REACT_APP_PROD_SERVER}/api/${
              type === "history" ? "ranking_history" : "weekly_rankings"
            }`
          : `http://localhost:4000/api/${
              type === "history" ? "ranking_history" : "weekly_rankings"
            }`
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
    return liveArr;
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

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
      changeDataLoading(true);
      const liveData = await getLiveData();
      changeLiveData(liveData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      changeDataLoading(true);
      const historicalLiveData = await getLiveData("history");
      changeHistoricalData(historicalLiveData);
    };
    fetchHistoricalData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        liveData,
        changeLiveData,
        dataLoading,
        changeDataLoading,
        darkMode,
        changeDarkMode,
        showRankingHistory,
        changeShowRankingHistory,
      }}
    >
      <div className="App">
        <HeaderLogo />
        {!dataLoading && showRankingHistory ? (
          <HistoricalResults historicalData={historicalData} />
        ) : !dataLoading && liveData && liveData.lives ? (
          <RoomResults liveData={liveData} />
        ) : (
          <div className="loader_container">
            <ClipLoader
              color={darkMode ? "#fff" : "#000"}
              loading={true}
              size={100}
            />
          </div>
        )}
      </div>
    </AppContext.Provider>
  );
};

export default App;
