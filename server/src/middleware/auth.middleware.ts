import { Middleware } from "../types";
import { UnauthorizedError } from "../utils/errors";

const protect: Middleware = (req, res, next) => {
  const { user } = req.session;

  if (user == null) {
    throw new UnauthorizedError();
  }

  req.user = user;

  next();
};

export { protect };
