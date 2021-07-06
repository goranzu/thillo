/** @jsxImportSource @emotion/react */

import { Link } from "react-router-dom";
import FormGroup from "../components/styled/FormGroup";
import Label from "../components/styled/Label";
import Input from "../components/styled/Input";
import Fieldset from "../components/styled/Fieldset";
import * as colors from "../styles/colors";
import { useSignup } from "../hooks/authHooks";
import { formatError, showError } from "../utils";

function Signup() {
  const signupMutation = useSignup();

  const errors = formatError(signupMutation.error);

  return (
    <main>
      <Link to="/">back</Link>
      <h1>Signup</h1>
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

          signupMutation.mutate({ email, password });
        }}
      >
        <Fieldset disabled={signupMutation.isLoading}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              required
              error={showError(signupMutation.isError, errors, "email")[0]}
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
            <Input
              required
              error={showError(signupMutation.isError, errors, "password")[0]}
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
          <button type="submit">Signup</button>
        </Fieldset>
      </form>
    </main>
  );
}

export default Signup;
