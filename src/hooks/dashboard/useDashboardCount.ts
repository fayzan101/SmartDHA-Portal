import { useQuery } from "@tanstack/react-query";
import { getDashboardCount } from "../../services/dashboard.service";

export const useDashboardCount = () => {
  return useQuery({
    queryKey: ["dashboard-count"],
    queryFn: getDashboardCount,
  });
};