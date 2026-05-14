import { useMutation } from "@tanstack/react-query";
import { createExternalWorker } from "../../services/worker.service";

export const useCreateWorker = () => {
  return useMutation({
    mutationFn: createExternalWorker,
  });
};