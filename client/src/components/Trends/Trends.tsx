import React, { useContext } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { timeLabels } from "./timeLabels";
import { AppContext } from "../../App";
import "./Trends.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Daily Diamond Trends",
    },
  },
  scales: {
    y: {
      ticks: {
        callback: (val: any, index: number) => {
          // Hide every 2nd tick label
          return index % 2 === 0 ? `${val / 1000}k` : "";
        },
      },
    },
    x: {
      ticks: {
        callback: function (val: any, index: number) {
          const newThis = this as any;
          // Hide every 2nd tick label
          return index % 2 === 0 ? newThis.getLabelForValue(val) : "";
        },
      },
    },
  },
};

export const Trends = () => {
  const { liveData } = useContext(AppContext);
  const lineChartData = {
    labels: timeLabels.slice(0, liveData?.diamondTrends?.length || 0),
    datasets: [
      {
        label: "Diamonds",
        data: liveData?.diamondTrends?.slice(
          0,
          liveData?.diamondTrends?.length || 0
        ),
        pointRadius: 10,
        pointHoverRadius: 10,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return (
    <div className="trend_graph_container">
      <Line options={options} data={lineChartData} />
    </div>
  );
};
