class NotFoundError extends Error {
  constructor(
    public message = "Route not found.",
    public param?: string,
    public statusCode = 404,
  ) {
    super(message);
  }
}

class BadUserInputError extends Error {
  constructor(
    public message = "Invalid Input.",
    public param?: string,
    public statusCode = 400,
  ) {
    super(message);
  }
}

class UnauthorizedError extends Error {
  constructor(
    public message = "Not Authorized.",
    public param?: string,
    public statusCode = 401,
  ) {
    super(message);
  }
}

export { NotFoundError, BadUserInputError, UnauthorizedError };
