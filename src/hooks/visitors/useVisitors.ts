import { useQuery } from "@tanstack/react-query";
import { getAllExternalVisitorPass } from "../../services/visitor.service";

export const useVisitors = (pageNumber: number, pageSize: number) => {
  return useQuery({
    queryKey: ["visitors", pageNumber, pageSize],
    queryFn: () => getAllExternalVisitorPass(pageNumber, pageSize),
  });
};