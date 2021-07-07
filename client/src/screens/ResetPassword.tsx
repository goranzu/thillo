/** @jsxImportSource @emotion/react */

import { Link, useParams } from "react-router-dom";
import FormGroup from "../components/styled/FormGroup";
import Label from "../components/styled/Label";
import InputStyled from "../components/styled/Input.styled";
import Fieldset from "../components/styled/Fieldset";
import * as colors from "../styles/colors";
import { useResetPassword } from "../hooks/authHooks";
import { formatError, showError } from "../utils";

function ResetPassword() {
  const resetPasswordMutation = useResetPassword();
  const { token } = useParams<{ token: string }>();

  const errors = formatError(resetPasswordMutation.error);

  return (
    <main>
      <Link to="/">back</Link>
      <h1>Reset Password</h1>
      <form
        css={{ maxWidth: "500px" }}
        onSubmit={async (e) => {
          e.preventDefault();
          const target = e.target as typeof e.target & {
            password: { value: string };
          };

          const password = target.password.value;

          if (!password || !token) {
            return;
          }

          resetPasswordMutation.mutate({ password, token });
        }}
      >
        <Fieldset disabled={resetPasswordMutation.isLoading}>
          <FormGroup>
            <Label htmlFor="password">Password</Label>
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

          <button type="submit">Reset password</button>
        </Fieldset>
      </form>
    </main>
  );
}

export default ResetPassword;
