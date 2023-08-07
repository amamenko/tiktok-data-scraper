import React from "react";
import { DailyLive } from "./DailyLive.interface";

export interface ContextProps {
  liveData: DailyLive | null;
  changeLiveData: React.Dispatch<React.SetStateAction<DailyLive | null>>;
  dataLoading: boolean;
  changeDataLoading: React.Dispatch<React.SetStateAction<boolean>>;
  darkMode: boolean;
  changeDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  showRankingHistory: boolean;
  changeShowRankingHistory: React.Dispatch<React.SetStateAction<boolean>>;
}
