import axios, { AxiosError } from "axios";
import { api } from "./config";
import { ErrorResponse } from "./hooks/authHooks";

export function formatError<T>(
  errors: AxiosError<ErrorResponse> | null,
): T | Record<string, string> {
  if (errors == null) {
    return {};
  }

  return (
    errors.response?.data.errors.reduce<Record<string, string>>(
      (acc, error) => {
        acc[error.param] = error.message;
        return acc;
      },
      {},
    ) || {}
  );
}

export const apiClient = axios.create({ baseURL: api, withCredentials: true });
