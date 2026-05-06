"use client"

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";

export default function AnalysisChart() {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
  const fetchAnalysis = async () => {
    try {
      const res = await fetch("https://dfpwebp.dhakarachi.org/api/smartdha/dashboard/analysis");
      const apiData = await res.json();

      console.log("Analysis API:", apiData);
      const formatted = apiData.weeklyDayWiseData.map((item: any) => ({
        day: item.dayName.slice(0, 3), // Mon, Tue...
        nonMembers: item.count,
        members: 0 // ⚠ since API doesn't give members
      }));

      setData(formatted);

    } catch (err) {
      console.log("Analysis error:", err);
    }
  };

  fetchAnalysis();
}, []);
  return (
    <div>
      <div className="flex items-center justify-center mb-2 relative">
        <h2 className="self-start text-xl font-bold absolute left-0">Analysis</h2>
        <div className="flex gap-2 mt-1 justify-center">
          <span className="bg-[#30B33D] text-white px-3 py-2 rounded-full text-xs font-semibold">Weekly</span>
          {/* <span className="bg-[#30B33D33] text-[#30B33D] px-3 py-2 rounded-full text-xs font-semibold">Monthly</span>
          <span className="bg-[#30B33D33] text-[#30B33D] px-3 py-2 rounded-full text-xs font-semibold">Yearly</span> */}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={0} barCategoryGap={16} style={{ outline: 'none' }}>
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontWeight: 500, fontSize: 14, fill: '#333' }}/>
          <YAxis tickLine={false} axisLine={false} tick={{ fontWeight: 500, fontSize: 14, fill: '#333' }}/>
          <Tooltip />
          <Bar dataKey="nonMembers" fill="#bbf7d0" radius={[10,10,0,0]} name="Non-Member" barSize={15} />
          <Bar dataKey="members" fill="#22c55e" radius={[10,10,0,0]} name="Members" barSize={15} />
          <CartesianGrid horizontal={true} vertical={false} stroke="#e0e0e0" strokeDasharray="5 3" />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex gap-6 mt-2 justify-center">
        <div className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-full" style={{ background: '#bbf7d0' }}></span>
          <span className="text-gray-700">Non-Member</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-full" style={{ background: '#22c55e' }}></span>
          <span className="text-gray-700">Members</span>
        </div>
      </div>
    </div>
  );
}
