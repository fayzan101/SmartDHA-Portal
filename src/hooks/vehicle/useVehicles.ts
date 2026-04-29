import { useQuery } from "@tanstack/react-query";
import { getAllExternalVehicles } from "../../services/vehicle.service";

export const useVehicles = (pageNumber: number, pageSize: number) => {
  return useQuery({
    queryKey: ["vehicles", pageNumber, pageSize],
    queryFn: () => getAllExternalVehicles(pageNumber, pageSize),
  });
};