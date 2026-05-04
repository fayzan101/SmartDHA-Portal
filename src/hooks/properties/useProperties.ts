import { useQuery } from "@tanstack/react-query";
import { getAllProperties } from "../../services/properties.service";

export const useProperties = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: ["properties", page, pageSize],
    queryFn: () =>
      getAllProperties({
        isActive: true,
        pageNumber: page,
        pageSize: pageSize,
      }),
  });
};