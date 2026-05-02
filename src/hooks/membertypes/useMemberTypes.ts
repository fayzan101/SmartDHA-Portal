import { useQuery } from "@tanstack/react-query";
import { getAllMemberTypesRequests } from "services/membertypes.service";

export const useMemberTypesRequests = () => {
  return useQuery({
    queryKey: ["member-types-requests"],
    queryFn: getAllMemberTypesRequests,
  });
};