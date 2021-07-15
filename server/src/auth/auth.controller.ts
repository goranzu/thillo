import debug from "debug";
import userService from "../user/user.service";
import appConfig from "../config";
import { Controller } from "../common/types";

const logger = debug("app:auth-controller");

class AuthController {
  signUp: Controller = async (req, res) => {
    const user = await userService.signUp(req.body);
    res.status(201).json({ data: user });
  };

  signIn: Controller = async (req, res) => {
    const user = await userService.signIn(req.body.email, req.body.password);

    //   Set the session
    req.session.user = {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
    };

    res.status(201).json({ data: user });
    return;
  };

  getMe: Controller = async (req, res) => {
    const user = res.locals.user;
    res.status(200).json({ data: user });
    return;
  };

  logout: Controller = async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        logger(err);
        throw new Error("Something went wrong...");
      }
      res.clearCookie(appConfig.cookieName).status(204).end();
    });
    return;
  };

  forgotPassword: Controller = async (req, res) => {
    await userService.forgotPassword(req.body.email);
    res.status(204).end();
    return;
  };

  resetPassword: Controller = async (req, res) => {
    await userService.resetPassword(req.body.password, req.body.token);
    res.status(204).end();
    return;
  };
}

export default new AuthController();
