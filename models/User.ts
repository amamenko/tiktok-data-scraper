import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    displayID: String,
    userID: String,
    avatar: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export { User };
