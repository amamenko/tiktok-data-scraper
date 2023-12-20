import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("TikTokAgencyScraper");

    const foundDoc = await db.collection("previousweektop100").findOne();

    if (foundDoc) {
      return NextResponse.json(foundDoc);
    } else {
      return NextResponse.json(false);
    }
  } catch (e) {
    if (process.env.NODE_ENV === "production") {
      logger("server").error(e);
    } else {
      console.error(e);
    }
    return NextResponse.json(false);
  }
}
