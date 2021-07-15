import { UnauthorizedError } from "../errors";
import { MiddlewareFunction } from "../types";

class AuthMiddleware {
  protect: MiddlewareFunction = (req, res, next) => {
    const { user } = req.session;

    if (user == null) {
      throw new UnauthorizedError();
    }

    req.user = user;

    next();
  };
}

export default new AuthMiddleware();
