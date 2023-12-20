import Image from "next/image";
import { rankPictureHash } from "./rankPictureHash";

interface TopDiamondBorderProps {
  index: number;
  lastWeekRank?: number;
}

export const TopDiamondBorder = ({
  index,
  lastWeekRank,
}: TopDiamondBorderProps) => {
  if (lastWeekRank !== undefined && rankPictureHash[lastWeekRank]) {
    return (
      <Image
        className={`top_100_border ${index === 0 ? "first_place" : ""} ${
          index === 1 || index === 2 ? "second_third_place" : ""
        } ${index > 2 ? "non_top_three" : ""} ${
          lastWeekRank === 0 ? "first_place_border" : ""
        } ${
          lastWeekRank === 1 || lastWeekRank === 2
            ? "second_third_place_border"
            : ""
        } ${lastWeekRank === 1 ? "second_place_border" : ""} ${
          lastWeekRank > 2 ? "non_top_three_border" : ""
        } ${lastWeekRank >= 49 ? "fifty_plus_border" : ""}`}
        src={rankPictureHash[lastWeekRank]}
        alt="First place border"
        width={lastWeekRank === 0 ? 75 : 65}
        height={lastWeekRank === 0 ? 75 : 65}
      />
    );
  }
};
