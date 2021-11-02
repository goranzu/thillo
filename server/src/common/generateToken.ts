import cuid from "cuid";

function generateToken(): string {
  return cuid();
}

export { generateToken };
