import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../utils";

interface Response {
  data: {
    id: number;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface Error {
  message: string;
  statusCode: number;
  stack: string;
  param: string;
}

export interface ErrorResponse {
  errors: Error[];
}

function useSignup() {
  const navigate = useNavigate();
  return useMutation<
    AxiosResponse<Response>,
    AxiosError<ErrorResponse>,
    { email: string; password: string }
  >((data) => apiClient.post(`/auth/signup`, data), {
    onSuccess: () => {
      setTimeout(() => {
        navigate("/signin");
      }, 1000);
    },
  });
}

function useSignin() {
  const navigate = useNavigate();
  //   const { updateAuthState } = useAuth();
  return useMutation<
    AxiosResponse<Response>,
    AxiosError<ErrorResponse>,
    { email: string; password: string }
  >((data) => apiClient.post(`/auth/signin`, data), {
    onSuccess: (response) => {
      const { data } = response.data;
      //   updateAuthState(data.id, data.email);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    },
  });
}

function useForgotPassword() {
  return useMutation<
    AxiosResponse<null>,
    AxiosError<ErrorResponse>,
    { email: string }
  >((data) => apiClient.post(`/auth/forgot-password`, data), {
    onSuccess: () => {
      alert("Instructions sent. Check your email.");
    },
  });
}

function useResetPassword() {
  return useMutation<
    AxiosResponse<null>,
    AxiosError<ErrorResponse>,
    { password: string; token: string }
  >((data) => apiClient.post(`/auth/reset-password`, data), {
    onSuccess: () => {
      alert("Password reset. You can login with your new password");
    },
    onError: (error) => {
      if (
        !!error.response?.data.errors.find(
          (err: Error) => err.param === "token",
        )
      ) {
        alert("Invalid Token.");
      }
    },
  });
}

export { useSignup, useSignin, useForgotPassword, useResetPassword };
