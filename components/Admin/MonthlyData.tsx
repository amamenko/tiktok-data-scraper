"use client";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ClipLoader } from "react-spinners";
import { useContext, useState } from "react";
import { ThemeContext } from "../Providers/Theme/ThemeProvider";
import { BiLogOut } from "react-icons/bi";
import { HeaderLogo } from "../Header/HeaderLogo";
import "./MonthlyData.scss";
import "../App/App.scss";
import { DarkModeToggle } from "../Room/DarkModeToggle";
import { format } from "date-fns";

const formatter = Intl.NumberFormat("en", {
  notation: "compact",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

interface MonthlyDataProps {
  monthlyData: {
    _id: string;
    diamonds: number;
  }[];
}

export const MonthlyData = ({ monthlyData }: MonthlyDataProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { darkMode } = useContext(ThemeContext);
  if (!session?.user) {
    router.push("/admin");
    return null;
  }
  return (
    <div
      className={`rooms_container monthly_data_page ${darkMode ? "dark" : ""}`}
    >
      <div className={`monthly_data_content ${darkMode ? "dark" : ""}`}>
        <div className="header_logo_container">
          <HeaderLogo />
        </div>
        <div className={`admin_monthly_data_header ${darkMode ? "dark" : ""}`}>
          <span
            className="log_out_button"
            onClick={() => signOut({ callbackUrl: "/admin" })}
          >
            <BiLogOut size={25} color={darkMode ? "#fff" : "#000"} />
          </span>
          <h1 className={`${darkMode ? "dark" : ""}`}>Monthly totals</h1>
          <DarkModeToggle />
        </div>
        <table className="monthly_total_table">
          <thead className="monthly_data_headers">
            <tr>
              <th>Month</th>
              <th>Total 💎</th>
              <th>Est. Actual 💎</th>
            </tr>
          </thead>
          <tbody className="monthly_data_body">
            {monthlyData.map((data) => {
              const dateParts = data._id.split("-");
              dateParts.splice(1, 0, "01");
              const startOfMonth = dateParts.join("/");

              const tikTokHighLowEstimates = {
                high: data.diamonds + 1406237,
                low: data.diamonds + 766321,
              };

              return (
                <tr className="monthly_data_container" key={data._id}>
                  <td>{format(new Date(startOfMonth), "MMM yyyy")}</td>
                  <td>{data.diamonds?.toLocaleString()}</td>
                  <td>
                    {formatter.format(tikTokHighLowEstimates.low)}-
                    {formatter.format(tikTokHighLowEstimates.high)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
