import { Controller, SignupInterface } from "../types";
import * as userService from "../resources/user/user.service";
import appConfig from "../config";

interface SigninInterface extends SignupInterface {}

const httpSignup: Controller<SignupInterface> = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const user = await userService.signUp({
    email,
    password,
    firstName,
    lastName,
  });

  res.status(200).json({ data: user });
  return;
};

const httpSignin: Controller<SigninInterface> = async (req, res) => {
  const { email, password } = req.body;

  const user = await userService.signIn(email, password);

  //   Set the session
  req.session.user = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  res.status(200).json({ data: user });
  return;
};

const httpGetMe: Controller<Record<string, never>> = async (req, res) => {
  const { user } = req.session;
  res.status(200).json({ data: user });
  return;
};

const httpLogout: Controller<Record<string, never>> = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      throw new Error("Something went wrong...");
    }
    res.clearCookie(appConfig.cookieName).status(204).end();
  });
  return;
};

const httpForgotPassword: Controller<{ email: string }> = async (req, res) => {
  const { email } = req.body;
  await userService.forgotPassword(email);

  res.status(204).end();
  return;
};

const httpResetPassword: Controller<{ password: string; token: string }> =
  async (req, res) => {
    const { password, token } = req.body;

    await userService.resetPassword(password, token);

    res.status(204).end();
    return;
  };

export {
  httpSignup,
  httpSignin,
  httpGetMe,
  httpLogout,
  httpForgotPassword,
  httpResetPassword,
};
