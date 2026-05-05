"use client"
import StatsCards from "./StatsCards"
import AnalysisChart from "./AnalysisChart"
import VehiclesChart from "./VehiclesChart"
import RecentActivities from "./RecentActivites"
import QuickAccess from "./QuickAccess"
import Alerts from "./Alerts"
import styles from "./DashboardComponents.module.css"

export default function Dashboard() {
  return (
    <div className={styles.dashboardRoot}>

      {/* LEFT MAIN DASHBOARD */}
      <div className={`${styles.dashboardMain} ${styles.spacedSection}`}>
        <StatsCards />
        <div 
        className="grid grid-cols-3 gap-6 bg-[#F9FAFB] rounded-2xl border border-[#f0f2f8] p-3"
          style={{
            boxShadow: "-10px -10px 20px 0 rgba(255,255,255,0.6), 3px 3px 20px 0 rgba(170,170,204,0.5)"
          }}
        >
          <div className="col-span-2 bg-white p-5 rounded-xl shadow">
            <AnalysisChart />
          </div>
          <div className="bg-white p-5 rounded-xl shadow">
            <VehiclesChart />
          </div>
        </div>
        {/* <QuickAccess /> 
        <RecentActivities />*/}
      </div>

    </div>
  )
}