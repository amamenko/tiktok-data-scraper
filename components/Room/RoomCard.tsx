import { useContext } from "react";
import { LiveRoom } from "../../interfaces/LiveRoom.interface";
import { ImageCircle } from "./ImageCircle";
import { ThemeContext } from "../Providers/Theme/ThemeProvider";
import "./RoomCard.scss";

const formatter = Intl.NumberFormat("en", {
  notation: "compact",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

interface RoomCardProps {
  live: LiveRoom;
  index: number;
}

export const RoomCard = ({ live, index }: RoomCardProps) => {
  const { darkMode } = useContext(ThemeContext);
  return (
    <div className={`room_outer_container ${darkMode ? "dark" : ""}`}>
      <div className="user_rank_container">
        <span className="user_rank_number_container">
          <p className="user_rank_number">{index + 4}</p>
        </span>
        <ImageCircle
          avatar={live.avatar}
          displayID={live.displayID}
          updatedAt={live.updatedAt}
          lastWeekRank={live.lastWeekRank}
          index={index + 3}
        />
        <p className="user_display_id">{live.displayID}</p>
      </div>
      <div className="diamonds_container">
        <div className="diamonds_inner_container">
          <p className="diamonds_count">
            {live.diamonds >= 1000
              ? formatter.format(live.diamonds)
              : live.diamonds}
          </p>
        </div>
      </div>
    </div>
  );
};
