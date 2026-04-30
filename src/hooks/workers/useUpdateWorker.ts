import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateExternalWorker,
  UpdateExternalWorkerRequest,
  UpdateExternalWorkerResponse,
} from "../../services/worker.service";

export const useUpdateWorker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateExternalWorker,
    onSuccess: (response) => {
      const workerId = response.data?.workerId;

      queryClient.invalidateQueries({ queryKey: ["workers"] });

      if (workerId) {
        queryClient.invalidateQueries({
          queryKey: ["worker", workerId],
        });
      }
    },
  });
};
