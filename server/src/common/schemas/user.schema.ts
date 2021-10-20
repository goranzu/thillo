import { object, string, TypeOf } from "zod";

export const signUpSchema = object({
  body: object({
    firstName: string({
      required_error: "firstName is required",
    }),
    lastName: string({
      required_error: "lastName is required",
    }),
    email: string({
      required_error: "email is required",
    }).email(),
    password: string({
      required_error: "password is required",
    }).length(4),
  }),
});

export const signInSchema = object({
  body: object({
    email: string({
      required_error: "email is required",
    }).email(),
    password: string({
      required_error: "password is required",
    }).length(4),
  }),
});

export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: "email is required",
    }).email(),
  }),
});

export const resetPasswordSchema = object({
  body: object({
    password: string({
      required_error: "password is required",
    }).length(4),
  }),
  params: object({
    token: string({
      required_error: "token is required",
    }),
  }),
});

export type SignUpUserInput = TypeOf<typeof signUpSchema>;
export type SignInUserInput = TypeOf<typeof signInSchema>;
export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>;
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;
