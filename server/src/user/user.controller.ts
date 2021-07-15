import { Controller } from "../common/types";
import userService from "./user.service";

class UserController {
  findByEmail: Controller = async (req, res) => {
    const { email } = req.body;
    if (email === res.locals.user.email) {
      res.status(204).end();
      return;
    }

    const user = await userService.findByEmail(req.body.email);
    res.status(200).json({ data: user });
    return;
  };

  list: Controller = async (req, res) => {
    const users = await userService.listAllUsers();
    res.status(200).json({ data: users });
    return;
  };
}

export default new UserController();
