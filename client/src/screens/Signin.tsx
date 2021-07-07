/** @jsxImportSource @emotion/react */

import React from "react";
import FormGroup from "../components/styled/FormGroup";
import Label from "../components/styled/Label";
import InputSyled from "../components/styled/Input.styled";
import Fieldset from "../components/styled/Fieldset";
import * as colors from "../styles/colors";
import { useSignin } from "../hooks/authHooks";
import { formatError, showError } from "../utils";
import AuthLayout from "../components/AuthLayout";
import signinImage from "../images/signin.png";
import ButtonStyled from "../components/styled/Button.styled";
import AuthFormHeader from "../components/AuthFormHeader";
import LinkStyled from "../components/styled/Link.styled";

function Signin() {
  const signinMutation = useSignin();

  const errors = formatError(signinMutation.error);

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

    signinMutation.mutate({ email, password });
  }

  return (
    <AuthLayout
      backgroundColor={colors.accent_200}
      imageUrl={signinImage}
      handleSubmit={handleSubmit}
    >
      <AuthFormHeader text="Sign In" />
      <Fieldset disabled={signinMutation.isLoading}>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <InputSyled
            required
            isError={showError(signinMutation.isError, errors, "email")[0]}
            type="email"
            name="email"
            id="email"
          />
          {showError(signinMutation.isError, errors, "email") && (
            <small css={{ fontSize: ".75rem", color: colors.danger }}>
              {showError(signinMutation.isError, errors, "email")[1]}
            </small>
          )}
        </FormGroup>
        <FormGroup>
          <div css={{ display: "flex", justifyContent: "space-between" }}>
            <Label htmlFor="password">Password</Label>
            <LinkStyled to="/forgot-password">Forgot Password?</LinkStyled>
          </div>
          <InputSyled
            required
            isError={showError(signinMutation.isError, errors, "password")[0]}
            type="password"
            name="password"
            id="password"
          />
          {showError(signinMutation.isError, errors, "password") && (
            <small css={{ fontSize: ".75rem", color: colors.danger }}>
              {showError(signinMutation.isError, errors, "password")[1]}
            </small>
          )}
        </FormGroup>
        <ButtonStyled variant="auth" type="submit">
          Sign In
        </ButtonStyled>
        <p css={{ fontSize: "var(--fs-300)" }}>
          Don't have an account yet?{" "}
          <LinkStyled to="/signin" isLoading={signinMutation.isLoading}>
            Sign Up.
          </LinkStyled>
        </p>
      </Fieldset>
    </AuthLayout>
  );
}

export default Signin;
