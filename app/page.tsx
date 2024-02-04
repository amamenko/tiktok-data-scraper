import clientPromise from "../lib/mongodb";
import App from "@/components/App/App";
import { getCurrentTop100Lives } from "./functions/getCurrentTop100Lives";

export const dynamic = "force-dynamic";
export const revalidate = false;

const connectToMongoDB = async () => {
  try {
    await clientPromise;
    return { isConnected: true };
  } catch (e) {
    console.error(e);
    return { isConnected: false };
  }
};

const getWeeklyTop100LiveResults = async () => {
  const resultResponse = await getCurrentTop100Lives();
  return JSON.parse(JSON.stringify(resultResponse));
};

export default async function Home() {
  const connected = await connectToMongoDB();
  const top100WeeklyLives = await getWeeklyTop100LiveResults();
  return <App top100WeeklyLives={top100WeeklyLives} />;
}
