import { useQuery } from "@tanstack/react-query";
import { getAllProperties } from "../../services/properties.service";

export const useProperties = (
  page: number,
  pageSize: number,
  isActive: boolean
) => {
  return useQuery({
    queryKey: ["properties", page, pageSize, isActive],
    queryFn: () =>
      getAllProperties({
        isActive,
        pageNumber: page,
        pageSize,
      }),
  });
};