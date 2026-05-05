import { useMutation } from "@tanstack/react-query";
import { login } from "../../services/auth.service";
import { LoginRequest, LoginResponse } from "../../types/auth.types";

export const useLogin = () => {
  return useMutation<LoginResponse, any, LoginRequest>({
    mutationFn: login,

    onSuccess: (data) => {
      // store token
      if (data.accessToken) {
        localStorage.setItem("token", data.accessToken);
      }

      // store user id
      if (data.id) {
        localStorage.setItem("userId", data.id);
      }

      // optional (useful later)
      if (data.role) {
        localStorage.setItem("role", data.role);
      }

      if (data.name) {
        localStorage.setItem("name", data.name);
      }
    },
  });
};