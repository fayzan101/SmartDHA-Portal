"use client";

import Image from "next/image";
import { useState, useRef } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
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

const MOCK_PROFILE = {
  name: "John Doe",
  profileImage: "/icons/Image.png",
  phoneNumber: "+92 300 1234567",
  email: "john.doe@example.com",
};

// ─── Pie Chart Component ─────────────────────────────────────────────────────
function PieChart({ members, nonMembers }: { members: number; nonMembers: number }) {
  const total = members + nonMembers;
  const memberPct = Math.round((members / total) * 100);
  const nonMemberPct = 100 - memberPct;

  const cx = 100;
  const cy = 100;
  const r = 85;

  // Convert percentage to SVG arc path
  function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  function slicePath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
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

  // Members = dark green, starts at 0°
  const membersStart = 0;
  const membersEnd = (members / total) * 360;

  // Non-members = light green, continues after members
  const nonMembersStart = membersEnd;
  const nonMembersEnd = 360;

  // Tooltip position — midpoint of non-member arc
  const tooltipAngle = nonMembersStart + (nonMembersEnd - nonMembersStart) / 2;
  const tooltipPos = polarToCartesian(cx, cy, r * 0.62, tooltipAngle);

  return (
    <div className="flex items-center gap-1">
      {/* ── Legend left ── */}
      <div className="flex flex-col gap-3 flex-shrink-0 pr-2">
        <div className="flex items-center gap-2">
          <span className="w-[9px] h-[9px] rounded-[3px] bg-[#22c55e] flex-shrink-0 shadow-sm" />
          <span className="text-[8px] text-black/50 whitespace-nowrap">
            {memberPct}% Members
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-[9px] h-[9px] rounded-[3px] bg-[#bbf7d0] flex-shrink-0 shadow-sm" />
          <span className="text-[8px] text-black/50 whitespace-nowrap">
            {nonMemberPct}% Non-Members
          </span>
        </div>
      </div>

      {/* ── Pie chart SVG ── */}
      <div className="flex-shrink-0 ml-auto">
        <svg
          width="123"
          height="123"
          viewBox="0 0 200 200"
          className="drop-shadow-sm"
        >
          {/* Non-members slice — light green (drawn first / behind) */}
          <path
            d={slicePath(cx, cy, r, nonMembersStart, nonMembersEnd)}
            fill="#bbf7d0"
          />

          {/* Members slice — dark green */}
          <path
            d={slicePath(cx, cy, r, membersStart, membersEnd)}
            fill="#22c55e"
          />

          {/* Tooltip bubble on non-members slice */}
          <g transform={`translate(${tooltipPos.x}, ${tooltipPos.y})`}>
            {/* Bubble background */}
            <rect
              x="-18"
              y="-13"
              width="36"
              height="22"
              rx="6"
              ry="6"
              fill="white"
              filter="url(#shadow)"
            />
            {/* Bubble tail */}
            <polygon
              points="-4,9 4,9 0,16"
              fill="white"
            />
            {/* Percentage text */}
            <text
              x="0"
              y="2"
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fill="#16a34a"
            >
              {nonMemberPct}%
            </text>

            {/* Drop shadow filter */}
            <defs>
              <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#00000018" />
              </filter>
            </defs>
          </g>
        </svg>
      </div>
    </div>
  );
}

// ─── SvgIcon Component ───────────────────────────────────────────────────────
function SvgIcon({ name, size, className }: { name: string; size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {name === "phone-icon" && (
        <path
          d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9845 21.5573 21.2136 21.352 21.4019C21.1467 21.5901 20.9046 21.7335 20.6407 21.8228C20.3769 21.9121 20.0974 21.9452 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.7738 17.3147 6.72533 15.2662 5.19 12.85C3.49992 10.2456 2.44837 7.28049 2.12 4.2C2.09497 3.9226 2.128 3.64314 2.21732 3.37925C2.30663 3.11537 2.45001 2.87332 2.63824 2.66802C2.82647 2.46272 3.05559 2.29913 3.31075 2.18755C3.56591 2.07596 3.84154 2.01901 4.12 2.02H7.12C7.54362 2.01574 7.95573 2.1556 8.28563 2.41406C8.61552 2.67252 8.84208 3.03299 8.92 3.44C9.11412 4.44726 9.41838 5.42758 9.83 6.36C9.96733 6.65366 10.013 6.98096 9.96116 7.3001C9.90933 7.61924 9.76237 7.91516 9.54 8.15L8.06 9.64C9.35751 11.9147 11.1253 13.6825 13.4 14.98L14.89 13.5C15.1248 13.2776 15.4208 13.1307 15.74 13.0788C16.0592 13.027 16.3865 13.0727 16.68 13.21C17.6126 13.6217 18.593 13.926 19.6 14.12C20.0071 14.1979 20.3676 14.4245 20.626 14.7544C20.8845 15.0843 21.0243 15.4964 21.02 15.92Z"
          stroke="#30B33D"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      )}
      {name === "email-icon" && (
        <>
          <path
            d="M22 6L12 13L2 6M2 4H22V18H2V4Z"
            stroke="#30B33D"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </>
      )}
      {name === "notification-icon" && (
        <>
          <path
            d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
            stroke="#30B33D"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
            stroke="#30B33D"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </>
      )}
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RightSidebar() {
  const [notifications] = useState(MOCK_NOTIFICATIONS);
  const [stats] = useState(MOCK_STATS);
  const [profile] = useState(MOCK_PROFILE);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="flex flex-col w-full h-full bg-white overflow-hidden">
      {/* ════════════════════════════════════════
          SECTION 1 — Organisation Card
      ════════════════════════════════════════ */}
      <div className="flex-shrink-0 px-4 py-5">
        <div className="rounded-xl p-4 bg-[#F9FAFB] flex flex-col items-center shadow-[0_0_15px_rgba(0,0,0,0.25)]">
          {/* Logo */}
          <div className="shadow-[0_0_15px_rgba(0,0,0,0.25)] rounded-full p-1.5">
            <Image
              src={profile?.profileImage || "/icons/Image.png"}
              alt="Profile Picture"
              width={80}
              height={80}
              className='flex-shrink-0 object-cover rounded-full'
            />
          </div>

          <div className="text-center leading-tight py-2">
            <p className="text-[18px] font-semibold text-[#30B33D]">
              {profile?.name || "-"}
            </p>
          </div>

          {/* Contact mini-card */}
          <div className="w-full rounded-lg space-y-1.5 shadow-[0_0_10px_rgba(0,0,0,0.25)]">
            <div className="flex items-center gap-3 px-3 pt-2 pb-1">
              {/* phone icon */}
              <div className="bg-white p-2 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.25)]">
                <SvgIcon name="phone-icon" size={12} className="" />
              </div>
              <span className="text-[12px] text-black font-medium">
                {profile?.phoneNumber || "-"}
              </span>
            </div>
            <div className="w-full h-px bg-[#ECECEC]" />
            <div className="flex items-center gap-3 px-3 pb-2 pt-1">
              {/* email icon */}
              <div className="bg-white px-2 py-2.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.25)]">
                <SvgIcon name="email-icon" size={12} className="" />
              </div>
              <span className="text-[12px] text-black font-medium max-w-[140px] truncate break-all block">
                {profile?.email || "-"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="flex-shrink-0 h-px bg-[#D9D9D9]" />

      {/* ════════════════════════════════════════
          SECTION 2 — Notifications
      ════════════════════════════════════════ */}
      <div className="flex flex-col flex-1 min-h-0 px-4 py-3 overflow-hidden">
        {/* Heading row */}
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[14px] font-semibold text-black">Notifications</h2>
          </div>
          {unreadCount > 0 && (
            <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>

        {/* Scrollable notification list */}
        <div
          ref={notifRef}
          className="flex-1 overflow-y-auto min-h-0 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.25)] divide-y divide-[#ECECEC]"
          style={{ maxHeight: "calc(5 * 72px)" }}
        >
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="flex items-center gap-2.5 px-3 py-3 transition-colors hover:bg-white"
            >
              {/* notification icon */}
              <div className="bg-[#F5F5FA] px-2 py-2 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.25)]">
                <SvgIcon name="notification-icon" size={14} className="" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-black truncate">
                  {notif.title}
                </p>
                <p className="text-[8px] text-black/50 mt-0.5 leading-relaxed line-clamp-2">
                  {notif.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      {/* ════════════════════════════════════════
          SECTION 3 — Total DHA Members + Pie
      ════════════════════════════════════════ */}
      <div className="flex-shrink-0 px-4 py-5">
        <div className="rounded-2xl px-5 pt-4 bg-[#F9FAFB] shadow-[0_0_15px_rgba(0,0,0,0.25)]">
          {/* Heading */}
          <p className="text-[12px] font-medium text-black mb-1">
            Total DHA Members
          </p>

          {/* Large count */}
          <p className="text-[32px] font-semibold text-[#30B33D] leading-none">
            {stats.totalMembers}
          </p>

          {/* Pie chart + legend */}
          <PieChart members={stats.members} nonMembers={stats.nonMembers} />
        </div>
      </div>
      </div>

    </div>
  );
}