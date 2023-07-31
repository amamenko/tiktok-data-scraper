import "dotenv/config";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import enforce from "express-sslify";
import { logger } from "./logger/logger";
import { getDailyRankings } from "./functions/getDailyRankings";
import { getWeeklyRankings } from "./functions/getWeeklyRankings";

const app = express();

// Cross-Origin Requests
app.use(cors());

// To show request body during POST requests
app.use(express.json());

const port = process.env.PORT || 4000;

if (process.env.NODE_ENV === "production") {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

app.get("/api/daily_rankings", [], async (req: Request, res: Response) => {
  getDailyRankings(req, res);
});

app.get("/api/weekly_rankings", [], async (req: Request, res: Response) => {
  getWeeklyRankings(req, res);
});

app.get("/", (req: Request, res: Response) => {
  res.send("The TikTok data scraper server is up and running!");
});

// Connect to MongoDB with Mongoose
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_CLUSTER}.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`
  )
  .then(() => {
    if (process.env.NODE_ENV === "production") {
      logger("server").info("Connected to MongoDB");
    } else {
      console.log("Connected to MongoDB");
    }
  })
  .catch((err) => {
    if (process.env.NODE_ENV === "production") {
      logger("server").error(err);
    } else {
      console.error(err);
    }
  });

app.listen(port, () => {
  if (process.env.NODE_ENV === "production") {
    logger("server").info(`Listening on port ${port}...`);
  } else {
    console.log(`Listening on port ${port}...`);
  }
});
