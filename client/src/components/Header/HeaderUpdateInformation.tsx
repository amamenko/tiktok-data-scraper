import React from "react";
import { formatDistance } from "date-fns";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { RefreshCountdownTimer } from "../Room/RefreshCountdownTimer";
import { DailyLive } from "../../interfaces/DailyLive.interface";

interface HeaderUpdateInformationProps {
  liveData: DailyLive;
}

export const HeaderUpdateInformation = ({
  liveData,
}: HeaderUpdateInformationProps) => {
  return (
    <div className="countdown_container">
      <div className="left_side_data_wrapper">
        {liveData.updatedAt && (
          <span className="information_line">
            Last update{" "}
            {formatDistance(new Date(liveData.updatedAt), new Date(), {
              addSuffix: true,
            })}{" "}
            <AiOutlineQuestionCircle
              data-tooltip-id="diamond-info-tooltip"
              data-tooltip-content="Diamond count is updated every 10 minutes"
              className="info_circle"
              size={15}
              color={"rgb(149, 148, 154)"}
            />
          </span>
        )}
        <span className="information_line">
          Restart in <RefreshCountdownTimer />
        </span>
      </div>
      <div className="right_side_data_wrapper">
        {/* <div className="ranking_history_button">
          <div className="ranking_medal_container">
            <div className="vl" />
            <div className="vl" />
            <div className="vl" />
            <div className="vl" />
          </div>
          <span>Ranking history</span>
        </div> */}
      </div>
    </div>
  );
};
