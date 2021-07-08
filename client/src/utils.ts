import axios, { AxiosError } from "axios";
import { api } from "./config";
import { ErrorResponse } from "./hooks/authHooks";

export function formatError(errors: AxiosError<ErrorResponse> | null) {
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

// export function formatError(error: any) {
//   return error?.response?.data.errors?.reduce((acc: any, error: any) => {
//     acc[error.param] = error.message;
//     return acc;
//   }, {});
// }

// export function showError(
//   isError: boolean,
//   errors: Record<string, string> | undefined,
//   field: string,
// ): [boolean, string?] {
//   if (isError && errors != null) {
//     return [field in errors, errors[field]];
//   }
//   return [false];
// }

export const apiClient = axios.create({ baseURL: api, withCredentials: true });
