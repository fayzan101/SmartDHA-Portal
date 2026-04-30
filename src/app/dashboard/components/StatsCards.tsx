import styles from "./DashboardComponents.module.css";
import { useDashboardCount } from "../../../hooks/dashboard/useDashboardCount";

export default function StatsCards() {
  const { data, isLoading, isError } = useDashboardCount();

  const syncStats = [
    { title: "Total Workers", value: data?.totalWorkers ?? "-", iconPath: "/icons/Stats/Stats.CPAgents.svg", iconAlt: "Total Workers" },
    { title: "Total Residents", value: data?.totalResidents ?? "-", iconPath: "/icons/Stats/Stats.Member.svg", iconAlt: "Total Residents" },
    { title: "Total Properties", value: data?.totalProperties ?? "-", iconPath: "/icons/Stats/Stats.Active.svg", iconAlt: "Total Properties" },
  ];

  return (
    <div className={styles.statsContainer}>
      {isError && <div className={styles.errorMessage}>Failed to load sync summary.</div>}
      <div className={styles.statsGrid}>
        {syncStats.map((item, i) => (
          <div key={i} className={styles.statsCard}>
            <div className={styles.statsIconBox}>
              <img src={item.iconPath} alt={item.iconAlt} className={styles.statsIconImg} />
            </div>
            <div>
              <div className={styles.statsTitle}>{item.title}</div>
              <div className={styles.statsValue}>{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}