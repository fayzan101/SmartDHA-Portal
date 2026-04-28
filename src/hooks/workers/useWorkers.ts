import { useQuery } from "@tanstack/react-query";
import { getAllExternalWorkers } from "../../services/worker.service";

export const useWorkers = (pageNumber: number, pageSize: number) => {
  return useQuery({
    queryKey: ["workers", pageNumber, pageSize],
    queryFn: () => getAllExternalWorkers(pageNumber, pageSize),
  });
};
