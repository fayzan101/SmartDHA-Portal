import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Query } from "@tanstack/react-query";
import {
  removeEmployee,
  RemoveEmployeeResponse,
} from "../../services/employee.service";

export const useRemoveEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation<RemoveEmployeeResponse, unknown, { id: string }>({
    mutationFn: ({ id }) => removeEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query: Query) => query.queryKey?.[0] === "employees",
      });
    },
  });
};