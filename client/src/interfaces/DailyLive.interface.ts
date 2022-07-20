import { LiveRoom } from "./LiveRoom.interface";

export interface DailyLive {
  lives: LiveRoom[];
  date: string;
  createdAt: string;
  updatedAt: string;
}
