import { GraphQLError } from "graphql";
import userModel, { IUser } from "~/models/user";
import redisClient from "~/core/redis";
import errorHandler from "~/controllers/error.controller";

import { signJwt, verifyJwt } from "~/core/jwt";

import type { Request, Response } from "express";

import {
  JWT_ACCESS_TOKEN_EXPIRED_IN,
  JWT_REFRESH_TOKEN_EXPIRED_IN,
} from "~/env.config";

interface SignupInput {
  input: {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
  };
}

interface SignInInput {
  input: {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
  };
}

const cookieOptions = {
  httpOnly: true,
  sameSite: false,
  secure: true,
};

const accessTokenCookieOptions = {
  ...cookieOptions,
  maxAge: JWT_ACCESS_TOKEN_EXPIRED_IN * 60 * 1000,
  expires: new Date(Date.now() + JWT_ACCESS_TOKEN_EXPIRED_IN * 60 * 1000),
};

const refreshTokenCookieOptions = {
  ...cookieOptions,
  maxAge: JWT_REFRESH_TOKEN_EXPIRED_IN * 60 * 1000,
  expires: new Date(Date.now() + JWT_REFRESH_TOKEN_EXPIRED_IN * 60 * 1000),
};

if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

/**
 * Signup function
 * @param {Object} parent - The parent object
 * @param {SignupInput} args - The input arguments
 * @param {Object} context - The context object
 * @returns {Object} - The result object
 */
const signup = async (
  parent: any,
  { input: { name, email, password, passwordConfirm } }: SignupInput,
  { req }: { req: Request }
) => {
  try {
    const user = await userModel.create({
      name,
      email,
      password,
      passwordConfirm,
    });

    return {
      status: "success",
      user,
    };
  } catch (error) {
    console.log(JSON.stringify(error));
    if (error.code === 11000) {
      throw new GraphQLError("User Already Exist", {
        extensions: {
          code: "FORBIDDEN",
        },
      });
    }
    errorHandler(error);
  }
};

/**
 * SignTokens function
 * @param {IUser} user - The user object
 * @returns {Object} - The tokens object
 */
async function signTokens(user: IUser) {
  // Create a Session
  await redisClient.set(user.id, JSON.stringify(user), {
    EX: 60 * 60,
  });

  // Create access token
  const access_token = signJwt({ user: user.id }, "JWT_ACCESS_PRIVATE_KEY", {
    expiresIn: `${JWT_ACCESS_TOKEN_EXPIRED_IN}m`,
  });

  // Create refresh token
  const refresh_token = signJwt({ user: user.id }, "JWT_REFRESH_PRIVATE_KEY", {
    expiresIn: `${JWT_REFRESH_TOKEN_EXPIRED_IN}m`,
  });

  return { access_token, refresh_token };
}

/**
 * Login function
 * @param {Object} parent - The parent object
 * @param {SignInInput} args - The input arguments
 * @param {Object} context - The context object
 * @returns {Object} - The result object
 */
const login = async (
  parent: any,
  { input: { email, password } }: SignInInput,
  { req, res }: { req: Request; res: Response }
) => {
  try {
    const user = await userModel
      .findOne({ email })
      .select("+password +verified");

    if (
      !user ||
      !(await user.comparePasswords(password, user.password ?? ""))
    ) {
      throw new GraphQLError("Invalid email or password", {
        extensions: {
          code: "AUTHENTICATION_ERROR",
        },
      });
    }

    if (user?.password) {
      delete user.password;
    }

    const { access_token, refresh_token } = await signTokens(user);

    res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions);
    res.cookie("access_token", access_token, accessTokenCookieOptions);
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    return {
      status: "success",
      access_token,
    };
  } catch (error) {
    errorHandler(error);
  }
};

export default {
  signup,
  login,
  // refreshAccessToken,
  // logoutHandler,
};
