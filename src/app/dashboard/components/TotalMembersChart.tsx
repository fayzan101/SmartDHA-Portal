"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";
import apiClient from "@/lib/apiClient";

const COLORS = ["#22c55e", "#bbf7d0"];

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
type StatsType = {
  totalMembers: number;
  members: number;
  nonMembers: number;
};

// ─────────────────────────────────────────────────────────────
// CUSTOM LABEL
// ─────────────────────────────────────────────────────────────
function renderCustomLabel(props: PieLabelRenderProps) {
  const {
    cx = 0,
    cy = 0,
    midAngle = 0,
    innerRadius = 0,
    outerRadius = 0,
    value = 0,
  } = props;

  const RADIAN = Math.PI / 180;

  const radius =
    innerRadius + (outerRadius - innerRadius) * 0.5;

  const x =
    cx + radius * Math.cos(-midAngle * RADIAN);

  const y =
    cy + radius * Math.sin(-midAngle * RADIAN);

  const width = 38;
  const height = 24;

  return (
    <g>
      <foreignObject
        x={x - width / 2}
        y={y - height / 2}
        width={width}
        height={height}
      >
        <div
          style={{
            background: "white",
            color: "#22c55e",
            borderRadius: 4,
            fontWeight: 700,
            fontSize: 12,
            width,
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px #0001",
          }}
        >
          {value}
        </div>
      </foreignObject>
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function TotalMembersChart() {
  const [stats, setStats] = useState<StatsType>({
    totalMembers: 0,
    members: 0,
    nonMembers: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await apiClient.get(
          "/api/smartdha/dashboard/analysis"
        );

        const data = response.data;

        console.log("Analysis API:", data);

        const members = data?.member?.total || 0;
        const nonMembers =
          data?.nonMember?.total || 0;

        setStats({
          totalMembers: members + nonMembers,
          members,
          nonMembers,
        });
      } catch (err) {
        console.log("Analysis API error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  // ✅ Dynamic chart data
  const chartData = [
    {
      name: "Members",
      value: stats.members,
    },
    {
      name: "Non Members",
      value: stats.nonMembers,
    },
  ];

  return (
    <div
      className="bg-white rounded-2xl px-1 flex flex-col h-full justify-between"
      style={{ minHeight: 260 }}
    >
      <div>
        <h2 className="font-bold mb-1 text-xl text-left">
          Total DHA Members
        </h2>

        <div className="text-green-600 text-3xl font-bold mb-2 text-left">
          {loading ? "..." : stats.totalMembers}
        </div>
      </div>

      <div className="flex items-end justify-center gap-2">
        {/* Legend */}
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-4 h-4 rounded bg-[#22c55e] inline-block"></span>

            <span className="text-gray-700">
              {stats.members} Members
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="w-4 h-4 rounded bg-[#bbf7d0] inline-block"></span>

            <span className="text-gray-700">
              {stats.nonMembers} Non Members
            </span>
          </div>
        </div>

        <ResponsiveContainer width={180} height={180}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              outerRadius={80}
              startAngle={270}
              endAngle={-90}
              label={renderCustomLabel}
              labelLine={false}
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}