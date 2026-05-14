import { useQuery } from "@tanstack/react-query";
import { getAllExternalWorkers } from "../../services/worker.service";

export const useWorkers = () => {
  return useQuery({
    queryKey: ["workers"],
    queryFn: async () => {
      const res = await getAllExternalWorkers();
      return res?.data?.items ?? [];
    },
  });
};