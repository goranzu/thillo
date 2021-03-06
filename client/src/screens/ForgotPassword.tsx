/** @jsxImportSource @emotion/react */

import React from "react";
import FormGroup from "../components/styled/FormGroup";
import Label from "../components/styled/Label";
import InputStyled from "../components/styled/Input.styled";
import Fieldset from "../components/styled/Fieldset";
import * as colors from "../styles/colors";
import { useForgotPassword } from "../hooks/authHooks";
import { formatError } from "../utils";
import AuthLayout from "../components/AuthLayout";
import AuthFormHeader from "../components/AuthFormHeader";
import signinImage from "../images/signin.png";
import ButtonStyled from "../components/styled/Button.styled";
import FormErrorMessage from "../components/styled/FormErrorMessage.styled";

function ForgotPassword() {
  const forgotPasswordMutation = useForgotPassword();

  const errors = formatError<{ email?: string }>(forgotPasswordMutation.error);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
    };

    const email = target.email.value;

    if (!email) {
      return;
    }

    forgotPasswordMutation.mutate({ email });
  }

  return (
    <AuthLayout
      imageUrl={signinImage}
      backgroundColor={colors.accent_100}
      handleSubmit={handleSubmit}
    >
      <AuthFormHeader text="Forgot Password" />
      <Fieldset disabled={forgotPasswordMutation.isLoading}>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <InputStyled
            required
            isError={Boolean(errors.email)}
            type="email"
            name="email"
            id="email"
          />
          {Boolean(errors.email) && (
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          )}
        </FormGroup>

        <ButtonStyled type="submit">Send reset instructions</ButtonStyled>
      </Fieldset>
    </AuthLayout>
  );
}

export default ForgotPassword;
