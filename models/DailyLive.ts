import mongoose from "mongoose";

const dailyLiveSchema = new mongoose.Schema(
  {
    date: String,
    lives: [
      {
        roomID: String,
        user: {
          displayID: String,
          userID: String,
          avatar: String,
        },
        diamonds: Number,
      },
    ],
  },
  { timestamps: true }
);

const DailyLive = mongoose.model("DailyLive", dailyLiveSchema);

export { DailyLive };
