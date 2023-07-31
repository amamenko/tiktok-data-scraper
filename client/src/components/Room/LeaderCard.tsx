import { LiveRoom } from "../../interfaces/LiveRoom.interface";
import { ImageCircle } from "./ImageCircle";
import numberOne from "../../assets/numberOne.svg";
import numberTwo from "../../assets/numberTwo.svg";
import numberThree from "../../assets/numberThree.svg";
import { useContext } from "react";
import { AppContext } from "../../App";
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
  const { darkMode } = useContext(AppContext);
  return (
    <div className={`leader-card-container ${darkMode ? "dark" : ""}`}>
      {index === 0 ? (
        <img
          className="rank-designator one"
          src={numberOne}
          alt="Number one rank"
        />
      ) : index === 1 ? (
        <img
          className="rank-designator two"
          src={numberTwo}
          alt="Number two rank"
        />
      ) : (
        <img
          className="rank-designator three"
          src={numberThree}
          alt="Number three rank"
        />
      )}
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
