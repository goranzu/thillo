/** @jsxImportSource @emotion/react */

import React from "react";
import FormGroup from "../components/styled/FormGroup";
import Label from "../components/styled/Label";
import InputStyled from "../components/styled/Input.styled";
import Fieldset from "../components/styled/Fieldset";
import * as colors from "../styles/colors";
import { useSignup } from "../hooks/authHooks";
import { formatError, showError } from "../utils";
import signupImage from "../images/signup.png";
import ButtonStyled from "../components/styled/Button.styled";
import LinkStyled from "../components/styled/Link.styled";
import AuthLayout from "../components/AuthLayout";
import AuthFormHeader from "../components/AuthFormHeader";

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
            isError={showError(signupMutation.isError, errors, "email")[0]}
            type="email"
            name="email"
            id="email"
          />
          {showError(signupMutation.isError, errors, "email") && (
            <small css={{ fontSize: ".75rem", color: colors.danger }}>
              {showError(signupMutation.isError, errors, "email")[1]}
            </small>
          )}
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <InputStyled
            required
            isError={showError(signupMutation.isError, errors, "password")[0]}
            type="password"
            name="password"
            id="password"
          />
          {showError(signupMutation.isError, errors, "password") && (
            <small css={{ fontSize: ".75rem", color: colors.danger }}>
              {showError(signupMutation.isError, errors, "password")[1]}
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
