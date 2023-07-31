import { LiveRoom } from "./LiveRoom.interface";

export interface DailyLive {
  lives: LiveRoom[];
  weekStarting: string;
  refreshAt: number;
}
