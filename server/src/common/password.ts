import crypto from "crypto";
import argon2 from "argon2";

async function hashPassword(password: string): Promise<{
  hashedPassword: string;
  passwordSalt: Buffer;
}> {
  const passwordSalt = crypto.randomBytes(32);
  const hashedPassword = await argon2.hash(password, { salt: passwordSalt });

  return { hashedPassword, passwordSalt };
}

async function verifyPassword(
  password: string,
  hashedPassword: string,
  passwordSalt: Buffer,
): Promise<boolean> {
  return argon2.verify(hashedPassword, password, { salt: passwordSalt });
}

export { hashPassword, verifyPassword };
