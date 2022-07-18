import "dotenv/config";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cron from "node-cron";
import cors from "cors";
import enforce from "express-sslify";
import { scrapeTikTok } from "./functions/scrapeTikTok";

const app = express();

// Cross-Origin Requests
app.use(cors());

// To show request body during POST requests
app.use(express.json());

const port = process.env.PORT || 4000;

if (process.env.NODE_ENV === "production") {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

// Scrape Tik Tok stats every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  scrapeTikTok();
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
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
