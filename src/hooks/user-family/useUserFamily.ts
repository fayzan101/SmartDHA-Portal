import { useQuery } from "@tanstack/react-query";
import { getAllUserFamily, UserFamily, UserFamilyGroup } from "../../services/user-family.service";

export const useUserFamily = () => {
  return useQuery<UserFamilyGroup[]>({
    queryKey: ["userFamilyList"],
    queryFn: getAllUserFamily,
  });
};