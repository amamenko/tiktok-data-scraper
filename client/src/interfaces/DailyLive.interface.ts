import { LiveRoom } from "./LiveRoom.interface";

export interface DailyLive {
  lives: LiveRoom[];
  date: string;
  diamondTrends?: number[];
  createdAt: string;
  updatedAt: string;
}
