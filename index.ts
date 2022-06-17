import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import enforce from "express-sslify";
import { scrapeTikTok } from "./functions/scrapeTikTok";

const app = express();

// Cross-Origin Requests
app.use(cors());

const port = process.env.PORT || 4000;

if (process.env.NODE_ENV === "production") {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

scrapeTikTok();

app.get("/", (req: Request, res: Response) => {
  res.send("The TikTok data scraper server is up and running!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
