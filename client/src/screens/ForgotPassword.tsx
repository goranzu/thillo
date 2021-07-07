/** @jsxImportSource @emotion/react */

import { Link } from "react-router-dom";
import FormGroup from "../components/styled/FormGroup";
import Label from "../components/styled/Label";
import InputStyled from "../components/styled/Input.styled";
import Fieldset from "../components/styled/Fieldset";
import * as colors from "../styles/colors";
import { useForgotPassword } from "../hooks/authHooks";
import { formatError, showError } from "../utils";

function ForgotPassword() {
  const forgotPasswordMutation = useForgotPassword();

  const errors = formatError(forgotPasswordMutation.error);

  return (
    <main>
      <Link to="/">back</Link>
      <h1>Forgot Password</h1>
      <form
        css={{ maxWidth: "500px" }}
        onSubmit={async (e) => {
          e.preventDefault();
          const target = e.target as typeof e.target & {
            email: { value: string };
          };

          const email = target.email.value;

          if (!email) {
            return;
          }

          forgotPasswordMutation.mutate({ email });
        }}
      >
        <Fieldset disabled={forgotPasswordMutation.isLoading}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <InputStyled
              required
              isError={
                showError(forgotPasswordMutation.isError, errors, "email")[0]
              }
              type="email"
              name="email"
              id="email"
            />
            {showError(forgotPasswordMutation.isError, errors, "email") && (
              <small css={{ fontSize: ".75rem", color: colors.danger }}>
                {showError(forgotPasswordMutation.isError, errors, "email")[1]}
              </small>
            )}
          </FormGroup>

          <button type="submit">Send reset instructions</button>
        </Fieldset>
      </form>
    </main>
  );
}

export default ForgotPassword;
