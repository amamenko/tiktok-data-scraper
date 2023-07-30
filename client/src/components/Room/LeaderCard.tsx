import { LiveRoom } from "../../interfaces/LiveRoom.interface";
import { ImageCircle } from "./ImageCircle";
import "./RoomCard.scss";

interface LeaderCardProps {
  live: LiveRoom;
  index: number;
}

const formatter = Intl.NumberFormat("en", {
  notation: "compact",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export const LeaderCard = ({ live, index }: LeaderCardProps) => {
  return (
    <div className="leader-card-container">
      <ImageCircle avatar={live.avatar} displayID={live.displayID} />
      <p className="leader-username">{live.displayID}</p>
      <p className="leader-diamonds">
        {live.diamonds >= 1000
          ? formatter.format(live.diamonds)
          : live.diamonds}
      </p>
    </div>
  );
};
