import { BadUserInputError } from "../errors";
import { MiddlewareFunction } from "../types";

class CommonMiddleware {
  extractParamToBody = (paramName: string): MiddlewareFunction => {
    return (req, res, next) => {
      const param = req.params[paramName];
      try {
        const paramToNumber = Number(param);
        if (Number.isNaN(paramToNumber)) {
          throw new BadUserInputError("Ivalid param.", param);
        }

        req.body[paramName] = paramToNumber;
        next();
      } catch (error) {
        throw new BadUserInputError("Ivalid param.", param);
      }
    };
  };
}

export default new CommonMiddleware();
