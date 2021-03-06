import { UnauthorizedError } from "../common/errors";
import { MiddlewareFunction } from "../common/types";

const protect: MiddlewareFunction = (req, res, next) => {
  const { user } = req.session;

  if (user == null) {
    throw new UnauthorizedError();
  }

  res.locals.user = user;

  next();
};

const checkIfUserIsMemberOfBoard: MiddlewareFunction = (req, res, next) => {
  const { boardId } = req.params;

  next();
};

export { protect, checkIfUserIsMemberOfBoard };
