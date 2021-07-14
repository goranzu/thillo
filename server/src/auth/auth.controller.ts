import { Request, Response } from "express";
import debug from "debug";
// import { SignupInterface } from "../types";
// import * as userService from "../resources/user/user.service";
import userService from "../resources/user/user.service";
import appConfig from "../config";

const logger = debug("app:auth-controller");

// interface SigninInterface extends SignupInterface {}

type Controller = (req: Request, res: Response) => Promise<any>;

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
    const user = req.user;
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

// const httpSignup: Controller = async (req, res) => {
//   const { email, password, firstName, lastName } = req.body;

//   const user = await userService.signUp({
//     email,
//     password,
//     firstName,
//     lastName,
//   });

//   res.status(200).json({ data: user });
//   return;
// };

// const httpSignin: Controller = async (req, res) => {
//   const { email, password } = req.body;

//   const user = await userService.signIn(email, password);

//   //   Set the session
//   req.session.user = {
//     id: user.id,
//     email: user.email,
//     name: `${user.firstName} ${user.lastName}`,
//   };

//   res.status(200).json({ data: user });
//   return;
// };

// const httpGetMe: Controller = async (req, res) => {
//   const { user } = req.session;
//   res.status(200).json({ data: user });
//   return;
// };

// const httpLogout: Controller = async (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       console.error(err);
//       throw new Error("Something went wrong...");
//     }
//     res.clearCookie(appConfig.cookieName).status(204).end();
//   });
//   return;
// };

// const httpForgotPassword: Controller = async (req, res) => {
//   const { email } = req.body;
//   await userService.forgotPassword(email);

//   res.status(204).end();
//   return;
// };

// const httpResetPassword: Controller = async (req, res) => {
//   const { password, token } = req.body;

//   await userService.resetPassword(password, token);

//   res.status(204).end();
//   return;
// };

// export {
//   httpSignup,
//   httpSignin,
//   httpGetMe,
//   httpLogout,
//   httpForgotPassword,
//   httpResetPassword,
// };
