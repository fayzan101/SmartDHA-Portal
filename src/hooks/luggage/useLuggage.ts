import { useQuery } from "@tanstack/react-query";
import { getAllLuggage } from "../../services/luggage.service";

export const useLuggage = (pageNumber: number, pageSize: number) => {
  return useQuery({
    queryKey: ["luggage", pageNumber, pageSize],
    queryFn: () => getAllLuggage(pageNumber, pageSize),
  });
};
