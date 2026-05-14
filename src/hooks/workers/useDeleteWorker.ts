import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExternalWorker } from "../../services/worker.service";

export const useDeleteWorker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteExternalWorker(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });
    },
  });
};