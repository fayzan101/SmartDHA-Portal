"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import apiClient from "@/lib/apiClient";

// ─── Mock Notifications / Stats ─────────────────────────────────────────────
const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    title: "New Member Joined",
    message: "Ali Khan has joined as a new member",
    time: "2 minutes ago",
    unread: true,
  },
  {
    id: "2",
    title: "Property Update",
    message: "New property listed in Phase 2",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: "3",
    title: "Payment Received",
    message: "Payment of $5,000 received from Sarah Ahmed",
    time: "3 hours ago",
    unread: false,
  },
  {
    id: "4",
    title: "Maintenance Request",
    message: "New maintenance request for Villa #123",
    time: "5 hours ago",
    unread: false,
  },
  {
    id: "5",
    title: "Meeting Scheduled",
    message: "Annual general meeting scheduled for March 15th",
    time: "1 day ago",
    unread: false,
  },
];

const MOCK_STATS = {
  totalMembers: 2540,
  members: 1850,
  nonMembers: 690,
};

// ─── Pie Chart ───────────────────────────────────────────────────────────────
function PieChart({
  members,
  nonMembers,
}: {
  members: number;
  nonMembers: number;
}) {
  const total = members + nonMembers;
  const memberPct = Math.round((members / total) * 100);
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

  const membersEnd = (members / total) * 360;

  const tooltipAngle = membersEnd + (360 - membersEnd) / 2;
  const tooltipPos = polarToCartesian(cx, cy, r * 0.62, tooltipAngle);

  return (
    <div className="flex items-center gap-1">
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

      <svg width="123" height="123" viewBox="0 0 200 200">
        <path
          d={slicePath(100, 100, r, membersEnd, 360)}
          fill="#bbf7d0"
        />
        <path
          d={slicePath(100, 100, r, 0, membersEnd)}
          fill="#22c55e"
        />

        <g transform={`translate(${tooltipPos.x}, ${tooltipPos.y})`}>
          <rect x="-18" y="-13" width="36" height="22" rx="6" fill="white" />
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

// ─── Icon ───────────────────────────────────────────────────────────────────
function SvgIcon({
  name,
  size,
}: {
  name: string;
  size: number;
  className?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">

      {/* ─── PHONE ICON (FILLED + CLEAN) ─── */}
      {name === "phone-icon" && (
        <path
          d="M6.62 10.79C8.06 13.94 10.54 16.42 13.69 17.86L15.77 15.78C16.04 15.51 16.43 15.42 16.78 15.53C17.93 15.91 19.19 16.12 20.5 16.12C21.05 16.12 21.5 16.57 21.5 17.12V20.5C21.5 21.05 21.05 21.5 20.5 21.5C10.61 21.5 2.5 13.39 2.5 3.5C2.5 2.95 2.95 2.5 3.5 2.5H6.88C7.43 2.5 7.88 2.95 7.88 3.5C7.88 4.81 8.09 6.07 8.47 7.22C8.58 7.57 8.49 7.96 8.22 8.23L6.62 10.79Z"
          fill="#30B33D"
        />
      )}

      {/* ─── EMAIL ICON (ENVELOPE FILLED STYLE) ─── */}
      {name === "email-icon" && (
        <path
          d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
          fill="#30B33D"
        />
      )}

    </svg>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function RightSidebar() {
  const [notifications] = useState(MOCK_NOTIFICATIONS);
  const [stats] = useState(MOCK_STATS);

  // ✅ REAL PROFILE STATE
  const [profile, setProfile] = useState<any>(null);

  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // ─── FETCH PROFILE API ────────────────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get(
          "/api/smartdha/user/getprofiledetail"
        );

        const data = res.data;

        setProfile({
          name: data.name,
          email: data.email,
          phoneNumber:
            data.phoneNumber || data.registteredMobileNumber || "-",
          profileImage:
            data.profileImage?.trim() || "/icons/Image.png",
        });
      } catch (err) {
        console.log("Profile fetch error:", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col w-full h-full bg-white">
      {/* ─── PROFILE ─────────────────────────────────────────────── */}
      {/* <div className="px-4 py-5">
        <div className="bg-[#F9FAFB] p-4 rounded-xl flex flex-col items-center shadow">
          <Image
            src={profile?.profileImage || "/icons/Image.png"}
            alt="profile"
            width={80}
            height={80}
            className="rounded-full object-cover"
          />

          <p className="text-[18px] font-semibold text-[#30B33D] mt-2">
            {profile?.name || "-"}
          </p>

          <div className="w-full mt-3 space-y-2">
            <div className="flex items-center gap-2">
              <SvgIcon name="phone-icon" size={14} />
              <span className="text-[14px]">
                {profile?.phoneNumber || "-"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <SvgIcon name="email-icon" size={14} />
              <span className="text-[14px]">
                {profile?.email || "-"}
              </span>
            </div>
          </div>
        </div>
      </div> */}

      {/* ─── NOTIFICATIONS ───────────────────────────────────────── */}
      <div className="px-4 py-5">
        <p className="font-semibold text-[16px] mb-2">Notifications</p>

        <div
          ref={notifRef}
          className="overflow-y-auto max-h-[300px] divide-y"
        >
          {notifications.map((n) => (
            <div key={n.id} className="py-2">
              <p className="text-[14px] font-medium">{n.title}</p>
              <p className="text-[12px] text-gray-500">{n.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── STATS ───────────────────────────────────────────────── */}
      <div className="px-4 py-5">
        <p className="text-[16px] font-medium">Total DHA Members</p>
        <p className="text-[28px] font-bold text-[#30B33D]">
          {stats.totalMembers}
        </p>

        <PieChart
          members={stats.members}
          nonMembers={stats.nonMembers}
        />
      </div>
    </div>
  );
}