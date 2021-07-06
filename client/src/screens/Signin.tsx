/** @jsxImportSource @emotion/react */

import { Link } from "react-router-dom";
import FormGroup from "../components/styled/FormGroup";
import Label from "../components/styled/Label";
import Input from "../components/styled/Input";
import Fieldset from "../components/styled/Fieldset";
import * as colors from "../styles/colors";
import { useSignin } from "../hooks/authHooks";
import { formatError, showError } from "../utils";

function Signin() {
  const signinMutation = useSignin();

  const errors = formatError(signinMutation.error);

  return (
    <main>
      <Link to="/">back</Link>
      <h1>Signin</h1>
      <form
        css={{ maxWidth: "500px" }}
        onSubmit={async (e) => {
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
        }}
      >
        <Fieldset disabled={signinMutation.isLoading}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              required
              error={showError(signinMutation.isError, errors, "email")[0]}
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
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
            <Input
              required
              error={showError(signinMutation.isError, errors, "password")[0]}
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
          <button type="submit">Signup</button>
        </Fieldset>
      </form>
    </main>
  );
}

export default Signin;
