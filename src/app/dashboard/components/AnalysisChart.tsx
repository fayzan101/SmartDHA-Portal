"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type ViewType = "weekly" | "monthly" | "yearly";

export default function AnalysisChart() {
  const [view, setView] = useState<ViewType>("weekly");

  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [yearlyData, setYearlyData] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await fetch(
          "https://dfpwebp.dhakarachi.org/api/smartdha/dashboard/analysis"
        );

        const apiData = await res.json();

        console.log("Analysis API:", apiData);

        // =========================
        // WEEKLY
        // =========================
        const formattedWeekly =
          apiData.nonMember.weeklyDayWiseData.map(
            (item: any, index: number) => ({
              label: item.dayName.slice(0, 3),
              nonMembers: item.count,
              members:
                apiData.member.weeklyDayWiseData[index]?.count || 0,
            })
          );

        // =========================
        // MONTHLY
        // =========================
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const last7Months: { year: number; monthIndex: number }[] = [];

        for (let i = 6; i >= 0; i--) {
          const date = new Date(currentYear, currentMonth - i, 1);

          last7Months.push({
            year: date.getFullYear(),
            monthIndex: date.getMonth(),
          });
        }

        const formattedMonthly = last7Months.map((m) => {
          const monthName = monthNames[m.monthIndex];

          const nonMemberFound =
            apiData.nonMember.monthWiseData.find(
              (item: any) =>
                item.month === monthName &&
                item.year === m.year
            );

          const memberFound =
            apiData.member.monthWiseData.find(
              (item: any) =>
                item.month === monthName &&
                item.year === m.year
            );

          return {
            label: monthName.slice(0, 3),
            nonMembers: nonMemberFound?.count || 0,
            members: memberFound?.count || 0,
          };
        });

        // =========================
        // YEARLY
        // =========================
        const formattedYearly =
          apiData.nonMember.yearWiseData.map(
            (item: any, index: number) => ({
              label: item.year.toString(),
              nonMembers: item.count,
              members:
                apiData.member.yearWiseData[index]?.count || 0,
            })
          );

        setWeeklyData(formattedWeekly);
        setMonthlyData(formattedMonthly);
        setYearlyData(formattedYearly);
      } catch (err) {
        console.log("Analysis error:", err);
      }
    };

    fetchAnalysis();
  }, []);

  const currentData =
    view === "weekly"
      ? weeklyData
      : view === "monthly"
      ? monthlyData
      : yearlyData;

  return (
    <div>
      <div className="flex items-center justify-center mb-2 relative">
        <h2 className="self-start text-xl font-bold absolute left-0">
          Analysis
        </h2>

        <div className="flex gap-2 mt-1 justify-center">
          <button
            onClick={() => setView("weekly")}
            className={`px-3 py-2 rounded-full text-xs font-semibold ${
              view === "weekly"
                ? "bg-[#30B33D] text-white"
                : "bg-[#30B33D33] text-[#30B33D]"
            }`}
          >
            Weekly
          </button>

          <button
            onClick={() => setView("monthly")}
            className={`px-3 py-2 rounded-full text-xs font-semibold ${
              view === "monthly"
                ? "bg-[#30B33D] text-white"
                : "bg-[#30B33D33] text-[#30B33D]"
            }`}
          >
            Monthly
          </button>

          <button
            onClick={() => setView("yearly")}
            className={`px-3 py-2 rounded-full text-xs font-semibold ${
              view === "yearly"
                ? "bg-[#30B33D] text-white"
                : "bg-[#30B33D33] text-[#30B33D]"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={currentData}
          barGap={0}
          barCategoryGap={16}
          style={{ outline: "none" }}
        >
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{
              fontWeight: 500,
              fontSize: 14,
              fill: "#333",
            }}
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            tick={{
              fontWeight: 500,
              fontSize: 14,
              fill: "#333",
            }}
          />

          <Tooltip />

          <Bar
            dataKey="nonMembers"
            fill="#bbf7d0"
            radius={[10, 10, 0, 0]}
            name="Non-Member"
            barSize={15}
          />

          <Bar
            dataKey="members"
            fill="#22c55e"
            radius={[10, 10, 0, 0]}
            name="Members"
            barSize={15}
          />

          <CartesianGrid
            horizontal={true}
            vertical={false}
            stroke="#e0e0e0"
            strokeDasharray="5 3"
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex gap-6 mt-2 justify-center">
        <div className="flex items-center gap-2 text-sm">
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: "#bbf7d0" }}
          ></span>
          <span className="text-gray-700">Non-Member</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: "#22c55e" }}
          ></span>
          <span className="text-gray-700">Members</span>
        </div>
      </div>
    </div>
  );
}