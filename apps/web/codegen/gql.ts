/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation Login($input: LoginInput!) {\n    loginUser(input: $input) {\n      access_token\n      refresh_token\n    }\n  }\n": types.LoginDocument,
    "\n  mutation SignUp($input: SignUpInput!) {\n    signupUser(input: $input) {\n      status\n    }\n  }\n": types.SignUpDocument,
    "\n  mutation OAuth($input: OAuthInput!) {\n    oAuth(input: $input) {\n      access_token\n      refresh_token\n    }\n  }\n": types.OAuthDocument,
    "\n  query GetMe {\n    getMe {\n      user {\n        createdAt\n        email\n        id\n        name\n        updatedAt\n      }\n    }\n  }\n": types.GetMeDocument,
    "\n  query Logout {\n    logoutUser\n  }\n": types.LogoutDocument,
    "\n  query GetFiles($search: String) {\n    getFiles(search: $search) {\n      name\n      thumbnail\n      updatedAt\n      userAccess {\n        userId {\n          _id\n          name\n          photo\n        }\n        role\n      }\n    }\n  }\n": types.GetFilesDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation Login($input: LoginInput!) {\n    loginUser(input: $input) {\n      access_token\n      refresh_token\n    }\n  }\n"): (typeof documents)["\n  mutation Login($input: LoginInput!) {\n    loginUser(input: $input) {\n      access_token\n      refresh_token\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation SignUp($input: SignUpInput!) {\n    signupUser(input: $input) {\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation SignUp($input: SignUpInput!) {\n    signupUser(input: $input) {\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation OAuth($input: OAuthInput!) {\n    oAuth(input: $input) {\n      access_token\n      refresh_token\n    }\n  }\n"): (typeof documents)["\n  mutation OAuth($input: OAuthInput!) {\n    oAuth(input: $input) {\n      access_token\n      refresh_token\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMe {\n    getMe {\n      user {\n        createdAt\n        email\n        id\n        name\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetMe {\n    getMe {\n      user {\n        createdAt\n        email\n        id\n        name\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Logout {\n    logoutUser\n  }\n"): (typeof documents)["\n  query Logout {\n    logoutUser\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetFiles($search: String) {\n    getFiles(search: $search) {\n      name\n      thumbnail\n      updatedAt\n      userAccess {\n        userId {\n          _id\n          name\n          photo\n        }\n        role\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetFiles($search: String) {\n    getFiles(search: $search) {\n      name\n      thumbnail\n      updatedAt\n      userAccess {\n        userId {\n          _id\n          name\n          photo\n        }\n        role\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;