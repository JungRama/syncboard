import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import errorHandler from "~/controllers/error.controller";

/**
 * Signs a JSON Web Token (JWT) using the provided payload, key, and options.
 * @param payload - The payload to be encoded in the JWT.
 * @param Key - The name of the environment variable that contains the secret key.
 * @param options - Additional options for signing the JWT.
 * @returns The signed JWT.
 */
export const signJwt = (
  payload: JwtPayload,
  Key: string,
  options: SignOptions
) => {
  // Retrieve the secret key from the environment variables
  const keySecret = process.env[Key] ?? "SECRET";

  // Sign the JWT using the payload, private key, and options
  return jwt.sign(payload, keySecret, {
    ...(options && options),
  });
};

/**
 * Verifies a JSON Web Token (JWT) using the provided token and key.
 * @param token - The JWT to be verified.
 * @param Key - The name of the environment variable that contains the secret key.
 * @returns The decoded payload of the verified JWT.
 */
export const verifyJwt = (token: string, Key: string) => {
  try {
    // Retrieve the secret key from the environment variables
    const keySecret = process.env[Key] ?? "SECRET";

    // Verify the JWT using the token and public key
    const decoded = jwt.verify(token, keySecret);

    return decoded as {
      user: string;
      iat: number;
      exp: number;
    };
  } catch (error) {
    // Handle any errors that occur during verification
    errorHandler(error);
  }
};
