/** @jsxImportSource @emotion/react */

import React from "react";
import { useParams, Link } from "react-router-dom";
import VisuallyHidden from "@reach/visually-hidden";
import FormGroup from "../components/styled/FormGroup";
import Label from "../components/styled/Label";
import InputStyled from "../components/styled/Input.styled";
import Fieldset from "../components/styled/Fieldset";
import * as colors from "../styles/colors";
import { useResetPassword } from "../hooks/authHooks";
import { formatError, showError } from "../utils";
import AuthLayout from "../components/AuthLayout";
import imageUrl from "../images/signin.png";
import AuthFormHeader from "../components/AuthFormHeader";
import ButtonStyled from "../components/styled/Button.styled";
import { ReactComponent as BackIcon } from "../images/icons/left-circle.svg";

function ResetPassword() {
  const resetPasswordMutation = useResetPassword();
  const { token } = useParams<{ token: string }>();

  const errors = formatError(resetPasswordMutation.error);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      password: { value: string };
    };

    const password = target.password.value;

    if (!password || !token) {
      return;
    }

    resetPasswordMutation.mutate({ password, token });
  }

  return (
    <>
      <Link css={{ position: "absolute", top: "3%", right: "5%" }} to="/signin">
        <VisuallyHidden>To signin page</VisuallyHidden>
        <BackIcon css={{ color: colors.textDark }} aria-hidden />
      </Link>
      <AuthLayout
        handleSubmit={handleSubmit}
        backgroundColor={colors.accent_200}
        imageUrl={imageUrl}
      >
        <AuthFormHeader text="Reset Password" />
        <Fieldset disabled={resetPasswordMutation.isLoading}>
          <FormGroup>
            <Label htmlFor="password">New Password</Label>
            <InputStyled
              required
              isError={
                showError(resetPasswordMutation.isError, errors, "password")[0]
              }
              type="password"
              name="password"
              id="password"
            />
            {showError(resetPasswordMutation.isError, errors, "password") && (
              <small css={{ fontSize: ".75rem", color: colors.danger }}>
                {
                  showError(
                    resetPasswordMutation.isError,
                    errors,
                    "password",
                  )[1]
                }
              </small>
            )}
          </FormGroup>

          <ButtonStyled type="submit">Reset password</ButtonStyled>
        </Fieldset>
      </AuthLayout>
    </>
  );
}

export default ResetPassword;
