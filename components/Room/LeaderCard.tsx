import { LiveRoom } from "../../interfaces/LiveRoom.interface";
import { ImageCircle } from "./ImageCircle";
import numberOne from "../../public/numberOne.svg";
import numberTwo from "../../public/numberTwo.svg";
import numberThree from "../../public/numberThree.svg";
import { useContext } from "react";
import Image from "next/image";
import { ThemeContext } from "../Providers/Theme/ThemeProvider";
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
  const { darkMode } = useContext(ThemeContext);
  return (
    <div className={`leader-card-container ${darkMode ? "dark" : ""}`}>
      {index === 0 ? (
        <Image
          className="rank-designator one"
          src={numberOne}
          alt="Number one rank"
          width={55}
        />
      ) : index === 1 ? (
        <Image
          className="rank-designator two"
          src={numberTwo}
          alt="Number two rank"
          width={50}
        />
      ) : (
        <Image
          className="rank-designator three"
          src={numberThree}
          alt="Number three rank"
          width={50}
        />
      )}
      <ImageCircle
        avatar={live.avatar}
        displayID={live.displayID}
        updatedAt={live.updatedAt}
        lastWeekRank={live.lastWeekRank}
        index={index}
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
