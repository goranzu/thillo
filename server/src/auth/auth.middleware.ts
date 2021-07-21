import { UnauthorizedError } from "../common/errors";
import { MiddlewareFunction } from "../common/types";

class AuthMiddleware {
  protect: MiddlewareFunction = (req, res, next) => {
    const { user } = req.session;

    if (user == null) {
      throw new UnauthorizedError();
    }

    res.locals.user = user;

    // req.user = user;

    next();
  };

  checkIfUserIsMemberOfBoard: MiddlewareFunction = (req, res, next) => {
    const { boardId } = req.params;

    next();
  };
}

export default new AuthMiddleware();
