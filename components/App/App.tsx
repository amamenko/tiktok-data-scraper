"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { contextDefaults } from "../../contextDefaults";
import { ClipLoader } from "react-spinners";
import { ContextProps } from "@/interfaces/ContextProps.interface";
import { DailyLive } from "@/interfaces/DailyLive.interface";
import { HeaderLogo } from "../Header/HeaderLogo";
import { HistoricalResults } from "../Room/HistoricalResults";
import { RoomResults } from "../Room/RoomResults";
import { ThemeContext } from "../Providers/Theme/ThemeProvider";
import "./App.scss";

export const AppContext = createContext<ContextProps>(contextDefaults);

interface AppProps {
  top100WeeklyLives: DailyLive | null;
}

const App = ({ top100WeeklyLives }: AppProps) => {
  const { darkMode, changeDarkMode } = useContext(ThemeContext);
  const [liveData, changeLiveData] = useState<DailyLive | null>(
    top100WeeklyLives
  );
  const [historicalData, changeHistoricalData] = useState<DailyLive | null>(
    null
  );

  const [showRankingHistory, changeShowRankingHistory] = useState(false);
  const [dataLoading, changeDataLoading] = useState(false);
  const [refreshTriggered, changeRefreshTriggered] = useState(false);

  const getLiveData = async (type?: string) => {
    const liveArr = await axios
      .get(
        type === "history"
          ? "/api/previous_week_top_100"
          : "/api/weekly_rankings",
        {
          // query URL without using browser cache
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
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
    const refetchData = async () => {
      changeRefreshTriggered(false);
      changeDataLoading(true);
      const liveData = await getLiveData();
      changeLiveData(liveData);
    };
    if (refreshTriggered) refetchData();
  }, [refreshTriggered]);

  useEffect(() => {
    if (showRankingHistory && !historicalData) {
      const fetchHistoricalData = async () => {
        changeDataLoading(true);
        const historicalLiveData = await getLiveData("history");
        changeHistoricalData(historicalLiveData);
      };
      fetchHistoricalData();
    }
  }, [showRankingHistory, historicalData]);

  return (
    <AppContext.Provider
      value={{
        liveData,
        changeLiveData,
        dataLoading,
        changeDataLoading,
        showRankingHistory,
        changeShowRankingHistory,
        refreshTriggered,
        changeRefreshTriggered,
      }}
    >
      <div className="App">
        <HeaderLogo />
        {showRankingHistory ? (
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
