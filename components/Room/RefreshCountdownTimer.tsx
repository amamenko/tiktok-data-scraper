import { useContext, useEffect, useState } from "react";
import Countdown from "react-countdown";
import { AppContext } from "../App/App";

export const RefreshCountdownTimer = ({
  handleComplete,
}: {
  handleComplete?: () => void;
}) => {
  const [endDate, changeEndDate] = useState<string | Date>("");
  const { liveData, darkMode } = useContext(AppContext);

  useEffect(() => {
    if (liveData?.refreshAt && !endDate) {
      changeEndDate(new Date(liveData.refreshAt));
    }
  }, [endDate, liveData?.refreshAt]);

  if (endDate) {
    return (
      <Countdown
        date={liveData?.refreshAt}
        autoStart={true}
        onComplete={handleComplete}
        renderer={({
          days,
          hours,
          minutes,
          seconds,
        }: {
          days: number;
          hours: number;
          minutes: number;
          seconds: number;
        }) => {
          return (
            <span className={`countdown_number_text ${darkMode ? "dark" : ""}`}>
              {days}d {hours}h {minutes}m {seconds}s
            </span>
          );
        }}
      />
    );
  } else {
    return <></>;
  }
};
