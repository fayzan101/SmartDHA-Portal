import styles from "./DashboardComponents.module.css";
import { useSyncSummary } from "../../../hooks/dashboard/useSyncSummary";

export default function StatsCards() {
  const { data, isLoading, isError } = useSyncSummary();

  const syncStats = [
    { title: "Total Workers", value: data?.data.totalRecords ?? "-", iconPath: "/icons/Stats/Stats.CPAgents.svg", iconAlt: "Total Records" },
    { title: "Total Residents", value: data?.data.totalSuccess ?? "-", iconPath: "/icons/Stats/Stats.Member.svg", iconAlt: "Total Success" },
    { title: "Total Properties", value: data?.data.totalFailed ?? "-", iconPath: "/icons/Stats/Stats.Active.svg", iconAlt: "Total Failed" },
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