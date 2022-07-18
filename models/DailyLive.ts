import mongoose from "mongoose";

const dailyLiveSchema = new mongoose.Schema(
  {
    date: String,
    lives: [
      {
        roomID: String,
        userID: String,
        diamonds: Number,
        createdAt: Date,
        updatedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

const DailyLive = mongoose.model("DailyLive", dailyLiveSchema);

export { DailyLive };
