import { GraphQLError } from "graphql";

/**
 * Handles a cast error by throwing a GraphQLError with the appropriate message.
 * @param error - The cast error object.
 * @throws {GraphQLError} - Throws a GraphQLError with the appropriate message.
 */
const handleCastError = (error: any) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  throw new GraphQLError(message, {
    extensions: {
      code: "GRAPHQL_VALIDATION_FAILED",
    },
  });
};

/**
 * Handles a validation error by throwing a GraphQLError with the appropriate message.
 * @param error - The validation error object.
 * @throws {GraphQLError} - Throws a GraphQLError with the appropriate message.
 */
const handleValidationError = (error: any) => {
  const message = Object.values(error.errors).map((el: any) => el.message);
  throw new GraphQLError(`Invalid input: ${message.join(", ")}`, {
    extensions: {
      code: "GRAPHQL_VALIDATION_FAILED",
    },
  });
};

/**
 * Error handler function that handles cast and validation errors.
 * @param err - The error object.
 * @throws {Error} - Throws the original error object if it's not a cast or validation error.
 */
const errorHandler = (err: any) => {
  if (err.name === "CastError") handleCastError(err);
  if (err.name === "ValidationError") handleValidationError(err);
  throw err;
};

export default errorHandler;
