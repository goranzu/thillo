import { Controller } from "../../types";
import { NotFoundError } from "../../utils/errors";
import userService from "./user.service";

const httpGetAllUsers: Controller<Record<string, unknown>> = async (
  req,
  res,
) => {
  const users = await userService.listAllUsers();

  res.status(200).json({ data: users });
  return;
};

const httpFindByEmail: Controller<{ email: string }> = async (req, res) => {
  const { email } = req.body;

  if (email === req.user.email) {
    res.status(204).end();
    return;
  }

  const user = await userService.findByEmail(email);

  if (user == null) {
    throw new NotFoundError("User not found.");
  }

  res.status(200).json({ data: user });
  return;
};

export { httpGetAllUsers, httpFindByEmail };
