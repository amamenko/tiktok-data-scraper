import { LiveRoom } from "../../interfaces/LiveRoom.interface";
import { ImageCircle } from "./ImageCircle";
import numberOne from "../../public/numberOne.svg";
import numberTwo from "../../public/numberTwo.svg";
import numberThree from "../../public/numberThree.svg";
import { useContext } from "react";
import { AppContext } from "../App/App";
import Image from "next/image";
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
        <Image
          className="rank-designator one"
          src={numberOne}
          alt="Number one rank"
          width={55}
          // height={71.7}
        />
      ) : index === 1 ? (
        <Image
          className="rank-designator two"
          src={numberTwo}
          alt="Number two rank"
          width={50}
          // height={64.7}
        />
      ) : (
        <Image
          className="rank-designator three"
          src={numberThree}
          alt="Number three rank"
          width={50}
          // height={64.7}
        />
      )}
      <ImageCircle
        avatar={live.avatar}
        displayID={live.displayID}
        updatedAt={live.updatedAt}
      />
      <p className="leader-username">{live.displayID}</p>
      <p className="leader-diamonds">
        {live.diamonds >= 1000
          ? formatter.format(live.diamonds)
          : live.diamonds}
      </p>
    </div>
  );
};
