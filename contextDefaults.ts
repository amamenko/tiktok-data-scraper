export const contextDefaults = {
  dataLoading: false,
  changeDataLoading: () => {},
  liveData: {
    lives: [],
    weekStarting: "",
    refreshAt: 0,
    updatedAt: 0,
  },
  changeLiveData: () => {},
  showRankingHistory: false,
  changeShowRankingHistory: () => {},
  refreshTriggered: false,
  changeRefreshTriggered: () => {},
};
