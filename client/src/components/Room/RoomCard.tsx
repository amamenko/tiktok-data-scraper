import { LiveRoom } from "../../interfaces/LiveRoom.interface";
// import { useContext } from "react";
// import { AppContext } from "../../App";
import "./RoomCard.scss";
import { ImageCircle } from "./ImageCircle";

const formatter = Intl.NumberFormat("en", {
  notation: "compact",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export const RoomCard = ({
  live,
  index,
}: {
  live: LiveRoom;
  index: number;
}) => {
  // const { darkMode } = useContext(AppContext);
  return (
    <div className="room_outer_container">
      <div className="user_rank_container">
        <p className="user_rank_number">{index + 4}</p>
        <ImageCircle avatar={live.avatar} displayID={live.displayID} />
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
