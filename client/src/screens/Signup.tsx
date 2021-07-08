/** @jsxImportSource @emotion/react */

import React from "react";
import FormGroup from "../components/styled/FormGroup";
import Label from "../components/styled/Label";
import InputStyled from "../components/styled/Input.styled";
import Fieldset from "../components/styled/Fieldset";
import * as colors from "../styles/colors";
import { useSignup } from "../hooks/authHooks";
import signupImage from "../images/signup.png";
import ButtonStyled from "../components/styled/Button.styled";
import LinkStyled from "../components/styled/Link.styled";
import AuthLayout from "../components/AuthLayout";
import AuthFormHeader from "../components/AuthFormHeader";
import { formatError } from "../utils";

function Signup() {
  const signupMutation = useSignup();

  const errors = formatError(signupMutation.error);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;
    if (!email || !password) {
      return;
    }
    signupMutation.mutate({ email, password });
  }

  return (
    <AuthLayout
      handleSubmit={handleSubmit}
      imageUrl={signupImage}
      backgroundColor={colors.accent_100}
    >
      <AuthFormHeader text="Sign Up" />
      <Fieldset disabled={signupMutation.isLoading}>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <InputStyled
            required
            isError={"email" in errors}
            type="email"
            name="email"
            id="email"
          />
          {"email" in errors && (
            <small css={{ fontSize: ".75rem", color: colors.danger }}>
              {errors["email"]}
            </small>
          )}
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <InputStyled
            required
            isError={"password" in errors}
            type="password"
            name="password"
            id="password"
          />

          {"password" in errors && (
            <small css={{ fontSize: ".75rem", color: colors.danger }}>
              {errors["password"]}
            </small>
          )}
        </FormGroup>
        <ButtonStyled variant="auth" type="submit">
          Sign Up
        </ButtonStyled>
        <p css={{ fontSize: "var(--fs-300)" }}>
          Already have an account?{" "}
          <LinkStyled to="/signin" isLoading={signupMutation.isLoading}>
            Sign In.
          </LinkStyled>
        </p>
      </Fieldset>
    </AuthLayout>
  );
}

export default Signup;
