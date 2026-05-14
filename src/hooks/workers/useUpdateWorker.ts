import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateExternalWorker } from "../../services/worker.service";

export const useUpdateWorker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateExternalWorker,
    onSuccess: (response: any) => {
      const workerId = response?.data?.workerId;

      // refresh worker list
      queryClient.invalidateQueries({ queryKey: ["workers"] });

      // refresh single worker cache if it exists
      if (workerId) {
        queryClient.invalidateQueries({
          queryKey: ["worker", workerId],
        });
      }
    },
  });
};