import React, { useContext } from "react";
import { BsBarChartFill } from "react-icons/bs";
import { differenceInMinutes } from "date-fns";
import Image from "next/image";
import { ThemeContext } from "../Providers/Theme/ThemeProvider";
import { TopDiamondBorder } from "./TopDiamondBorder";

interface ImageCircleProps {
  avatar: string;
  displayID: string;
  updatedAt: number;
  index: number;
  lastWeekRank?: number;
}

export const ImageCircle = ({
  avatar,
  displayID,
  updatedAt,
  index,
  lastWeekRank,
}: ImageCircleProps) => {
  const { darkMode } = useContext(ThemeContext);
  const lastUpdatedMinutesAgo = Math.abs(
    differenceInMinutes(Date.now(), updatedAt)
  );
  const currentlyLive = lastUpdatedMinutesAgo <= 12;
  const renderImage = () => {
    return (
      <>
        <Image
          className={`user_image_circle ${
            currentlyLive ? "live_currently" : ""
          }`}
          src={
            avatar.includes(".com")
              ? avatar
              : `data:image/jpeg;base64,${avatar}`
          }
          alt={`${displayID} avatar`}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='300px' width='300px' version='1.1' viewBox='-300 -300 600 600' font-family='Bitstream Vera Sans,Liberation Sans, Arial, sans-serif' font-size='72' text-anchor='middle'%3E%3Ccircle stroke='%23AAA' stroke-width='10' r='280' fill='%23FFF'/%3E%3Ctext style='fill:%23444;'%3E%3Ctspan x='0' y='-8'%3ENO IMAGE%3C/tspan%3E%3Ctspan x='0' y='80'%3EAVAILABLE%3C/tspan%3E%3C/text%3E%3C/svg%3E";
          }}
          width={50}
          height={50}
        />
        <TopDiamondBorder lastWeekRank={lastWeekRank} index={index} />
        {currentlyLive && (
          <span className="live_currently_icon_circle">
            <BsBarChartFill color="#fff" size={9} />
          </span>
        )}
      </>
    );
  };
  return (
    <div className={`user_image_wrapper ${darkMode ? "dark" : ""}`}>
      <a
        href={`https://www.tiktok.com/@${displayID}${
          currentlyLive ? "/live" : ""
        }`}
        rel="noopener noreferrer"
        target="_blank"
      >
        {renderImage()}
      </a>
    </div>
  );
};
