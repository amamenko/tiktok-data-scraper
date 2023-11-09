import clientPromise from "../lib/mongodb";
import App from "@/components/App/App";
import { getDateBoundaries } from "./functions/getDateBoundaries";
import { getTop100LiveResults } from "./functions/getTop100LiveResults";

export const connectToMongoDB = async () => {
  try {
    await clientPromise;
    return { isConnected: true };
  } catch (e) {
    console.error(e);
    return { isConnected: false };
  }
};

export const getWeeklyTop100LiveResults = async () => {
  const {
    boundaryDatesArr,
    weekStartsOnDate,
    formattedBeginningDay,
    weekStartsOnFormatted,
  } = getDateBoundaries();

  const resultResponse = await getTop100LiveResults(
    boundaryDatesArr,
    weekStartsOnDate,
    formattedBeginningDay,
    weekStartsOnFormatted
  );

  return JSON.parse(JSON.stringify(resultResponse));
};

export default async function Home() {
  const connected = await connectToMongoDB();
  const top100WeeklyLives = await getWeeklyTop100LiveResults();
  return <App top100WeeklyLives={top100WeeklyLives} />;
}
