import { GraphQLError } from "graphql";
import errorHandler from "../controllers/error.controller.js";
import { UserAuthFn } from "./user-auth.js";
import { Request } from "express";

/**
 * Checks if the user is authenticated.
 *
 * @param {Request} req - The request object.
 * @param {UserAuthFn} userAuth - The function to authenticate the user.
 */
const checkAuth = async (req: Request, userAuth: UserAuthFn) => {
  try {
    // Authenticate the user
    const authUser = await userAuth(req);

    if (!authUser) {
      // Throw an error if user is not authenticated
      throw new GraphQLError("You are not logged in", {
        extensions: {
          code: "AUTHENTICATION_ERROR",
        },
      });
    }
  } catch (error) {
    // Handle error
    errorHandler(error);
  }
};

export default checkAuth;
