"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";

// ─────────────────────────────────────────────────────────────
// MOCK STATS
// ─────────────────────────────────────────────────────────────
const MOCK_STATS = {
  totalMembers: 2540,
  members: 1850,
  nonMembers: 690,
};

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
type StatsType = {
  totalMembers: number;
  members: number;
  nonMembers: number;
};

// ─────────────────────────────────────────────────────────────
// PIE CHART COMPONENT
// ─────────────────────────────────────────────────────────────
function PieChart({
  members,
  nonMembers,
}: {
  members: number;
  nonMembers: number;
}) {
  const total = members + nonMembers;

  const memberPct =
    total > 0 ? Math.round((members / total) * 100) : 0;

  const nonMemberPct = 100 - memberPct;

  const cx = 100;
  const cy = 100;
  const r = 85;

  function polarToCartesian(
    cx: number,
    cy: number,
    r: number,
    angleDeg: number
  ) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;

    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  function slicePath(
    cx: number,
    cy: number,
    r: number,
    startAngle: number,
    endAngle: number
  ) {
    const start = polarToCartesian(cx, cy, r, startAngle);
    const end = polarToCartesian(cx, cy, r, endAngle);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return [
      `M ${cx} ${cy}`,
      `L ${start.x} ${start.y}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`,
      "Z",
    ].join(" ");
  }

  const membersEnd =
    total > 0 ? (members / total) * 360 : 0;

  const tooltipAngle =
    membersEnd + (360 - membersEnd) / 2;

  const tooltipPos = polarToCartesian(
    cx,
    cy,
    r * 0.62,
    tooltipAngle
  );

  return (
    <div className="flex items-center gap-1 mt-4">
      {/* LEGENDS */}
      <div className="flex flex-col gap-3 flex-shrink-0 pr-2">
        <div className="flex items-center gap-2">
          <span className="w-[9px] h-[9px] rounded-[3px] bg-[#22c55e]" />

          <span className="text-[12px] text-black/50">
            {memberPct}% Members
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-[9px] h-[9px] rounded-[3px] bg-[#bbf7d0]" />

          <span className="text-[12px] text-black/50">
            {nonMemberPct}% Non-Members
          </span>
        </div>
      </div>

      {/* PIE */}
      <svg width="123" height="123" viewBox="0 0 200 200">
        {/* NON MEMBERS */}
        <path
          d={slicePath(100, 100, r, membersEnd, 360)}
          fill="#bbf7d0"
        />

        {/* MEMBERS */}
        <path
          d={slicePath(100, 100, r, 0, membersEnd)}
          fill="#22c55e"
        />

        {/* TOOLTIP */}
        <g transform={`translate(${tooltipPos.x}, ${tooltipPos.y})`}>
          <rect
            x="-18"
            y="-13"
            width="36"
            height="22"
            rx="6"
            fill="white"
          />

          <text
            x="0"
            y="2"
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fill="#16a34a"
          >
            {nonMemberPct}%
          </text>
        </g>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function TotalMembersChart() {

  // USING MOCK DATA
  const [stats, setStats] = useState<StatsType>(MOCK_STATS);

  const [loading, setLoading] = useState(false);

  // ───────────────────────────────────────────────────────────
  // OPTIONAL API
  // ───────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchDashboardCounts = async () => {
      try {
        setLoading(true);

        const response = await apiClient.post(
          "/api/smartdha/dashboard/dashboard-count",
          {}
        );

        const data = response.data;

        console.log("Dashboard Count API:", data);

        // ONLY UPDATE IF API RETURNS VALID DATA
        setStats({
          totalMembers:
            data.totalMembers ??
            data.totalmembers ??
            MOCK_STATS.totalMembers,

          members:
            data.members ??
            data.memberCount ??
            MOCK_STATS.members,

          nonMembers:
            data.nonMembers ??
            data.nonmembers ??
            data.nonMemberCount ??
            MOCK_STATS.nonMembers,
        });

      } catch (error) {
        console.log(
          "Dashboard Count Error, using mock data:",
          error
        );

        // FALLBACK TO MOCK DATA
        setStats(MOCK_STATS);

      } finally {
        setLoading(false);
      }
    };

    fetchDashboardCounts();
  }, []);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm w-full">
      {/* TITLE */}
      <p className="text-[16px] font-medium text-black">
        Total DHA Members
      </p>

      {/* TOTAL */}
      <p className="text-[30px] font-bold text-[#30B33D] mt-1">
        {loading ? "..." : stats.totalMembers}
      </p>

      {/* CHART */}
      <PieChart
        members={stats.members}
        nonMembers={stats.nonMembers}
      />

      {/* BOTTOM STATS */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="bg-[#F8FAFC] rounded-xl p-3">
          <p className="text-[12px] text-gray-500">
            Members
          </p>

          <p className="text-[20px] font-semibold text-[#22c55e]">
            {stats.members}
          </p>
        </div>

        <div className="bg-[#F8FAFC] rounded-xl p-3">
          <p className="text-[12px] text-gray-500">
            Non Members
          </p>

          <p className="text-[20px] font-semibold text-[#16a34a]">
            {stats.nonMembers}
          </p>
        </div>
      </div>
    </div>
  );
}