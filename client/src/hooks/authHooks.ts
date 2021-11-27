import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../utils";

export interface SignResponse {
  data: {
    id: number;
    name: string;
    email: string;
  };
}
export interface RegisterResponse extends SignResponse {}

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
    AxiosResponse<RegisterResponse>,
    AxiosError<ErrorResponse>,
    { email: string; password: string; firstName: string; lastName: string }
  >((data) => apiClient.post(`/signup`, data), {
    onSuccess: () => {
      setTimeout(() => {
        navigate("/signin");
      }, 1000);
    },
  });
}

function useSignin() {
  const navigate = useNavigate();
  const { updateAuthState } = useAuth();
  return useMutation<
    AxiosResponse<SignResponse>,
    AxiosError<ErrorResponse>,
    { email: string; password: string }
  >((data) => apiClient.post(`/signin`, data), {
    onSuccess: (response) => {
      const { data } = response.data;
      console.log(data);
      updateAuthState(data.id, data.email);
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
  >((data) => apiClient.post(`/forgot-password`, data), {
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
  >(
    (data) =>
      apiClient.post(`/reset-password/${data.token}`, {
        password: data.password,
      }),
    {
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
    },
  );
}

export { useSignup, useSignin, useForgotPassword, useResetPassword };
