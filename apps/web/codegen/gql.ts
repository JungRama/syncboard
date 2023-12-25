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
    "\n  mutation SignUp($input: SignUpInput!) {\n    signupUser(input: $input)\n  }\n": types.SignUpDocument,
    "\n  mutation OAuth($input: OAuthInput!) {\n    oAuth(input: $input) {\n      access_token\n      refresh_token\n    }\n  }\n": types.OAuthDocument,
    "\n  mutation VerifyAccount($input: verifyAccountInput!) {\n    verifyAccount(input: $input) {\n      access_token\n      refresh_token\n    }\n  }\n": types.VerifyAccountDocument,
    "\n  query GetMe {\n    getMe {\n      user {\n        createdAt\n        email\n        photo\n        id\n        name\n        updatedAt\n      }\n    }\n  }\n": types.GetMeDocument,
    "\n  query RefreshAccessToken($refreshAccessToken: String!) {\n    refreshAccessToken(refresh_token: $refreshAccessToken) {\n      access_token\n      refresh_token\n    }\n  }\n": types.RefreshAccessTokenDocument,
    "\n  query Logout {\n    logoutUser\n  }\n": types.LogoutDocument,
    "\n  query GetFiles($search: String) {\n    getFiles(search: $search) {\n      id\n      name\n      thumbnail\n      updatedAt\n      isPublic\n      userAccess {\n        userId {\n          _id\n          name\n          photo\n          email\n        }\n        role\n      }\n    }\n  }\n": types.GetFilesDocument,
    "\n  query GetFavorites {\n    getFavorites {\n      name\n      id\n    }\n  }\n": types.GetFavoritesDocument,
    "\n  query GetFileById($id: String!, $isPublic: Boolean!) {\n    getFileById(id: $id, isPublic: $isPublic) {\n      id\n      name\n      thumbnail\n      updatedAt\n      whiteboard\n      isPublic\n      userAccess {\n        userId {\n          _id\n          name\n          photo\n          email\n        }\n        role\n      }\n    }\n  }\n": types.GetFileByIdDocument,
    "\n  mutation CreateFile {\n    createFile {\n      id\n    }\n  }\n": types.CreateFileDocument,
    "\n  mutation UpdateFile($input: UpdateFileInput!) {\n    updateFile(input: $input) {\n      id\n    }\n  }\n": types.UpdateFileDocument,
    "\n  mutation AddNewUserAccess($input: NewUserAccessInput!) {\n    addNewUserAccess(input: $input) {\n      userId {\n        _id\n        name\n        email\n        photo\n      }\n      role\n    }\n  }\n": types.AddNewUserAccessDocument,
    "\n  mutation ChangeUserAccess($input: ChangeUserAccessInput!) {\n    changeUserAccess(input: $input) {\n      userId {\n        _id\n        name\n        email\n        photo\n      }\n      role\n    }\n  }\n": types.ChangeUserAccessDocument,
    "\n  mutation ToogleIsPublic($input: ToogleIsPublicInput!) {\n    toogleIsPublic(input: $input)\n  }\n": types.ToogleIsPublicDocument,
    "\n  mutation ToogleFavorite($input: ToogleFavoriteInput!) {\n    toogleFavorite(input: $input) {\n      id\n    }\n  }\n": types.ToogleFavoriteDocument,
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
export function gql(source: "\n  mutation SignUp($input: SignUpInput!) {\n    signupUser(input: $input)\n  }\n"): (typeof documents)["\n  mutation SignUp($input: SignUpInput!) {\n    signupUser(input: $input)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation OAuth($input: OAuthInput!) {\n    oAuth(input: $input) {\n      access_token\n      refresh_token\n    }\n  }\n"): (typeof documents)["\n  mutation OAuth($input: OAuthInput!) {\n    oAuth(input: $input) {\n      access_token\n      refresh_token\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation VerifyAccount($input: verifyAccountInput!) {\n    verifyAccount(input: $input) {\n      access_token\n      refresh_token\n    }\n  }\n"): (typeof documents)["\n  mutation VerifyAccount($input: verifyAccountInput!) {\n    verifyAccount(input: $input) {\n      access_token\n      refresh_token\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMe {\n    getMe {\n      user {\n        createdAt\n        email\n        photo\n        id\n        name\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetMe {\n    getMe {\n      user {\n        createdAt\n        email\n        photo\n        id\n        name\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query RefreshAccessToken($refreshAccessToken: String!) {\n    refreshAccessToken(refresh_token: $refreshAccessToken) {\n      access_token\n      refresh_token\n    }\n  }\n"): (typeof documents)["\n  query RefreshAccessToken($refreshAccessToken: String!) {\n    refreshAccessToken(refresh_token: $refreshAccessToken) {\n      access_token\n      refresh_token\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Logout {\n    logoutUser\n  }\n"): (typeof documents)["\n  query Logout {\n    logoutUser\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetFiles($search: String) {\n    getFiles(search: $search) {\n      id\n      name\n      thumbnail\n      updatedAt\n      isPublic\n      userAccess {\n        userId {\n          _id\n          name\n          photo\n          email\n        }\n        role\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetFiles($search: String) {\n    getFiles(search: $search) {\n      id\n      name\n      thumbnail\n      updatedAt\n      isPublic\n      userAccess {\n        userId {\n          _id\n          name\n          photo\n          email\n        }\n        role\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetFavorites {\n    getFavorites {\n      name\n      id\n    }\n  }\n"): (typeof documents)["\n  query GetFavorites {\n    getFavorites {\n      name\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetFileById($id: String!, $isPublic: Boolean!) {\n    getFileById(id: $id, isPublic: $isPublic) {\n      id\n      name\n      thumbnail\n      updatedAt\n      whiteboard\n      isPublic\n      userAccess {\n        userId {\n          _id\n          name\n          photo\n          email\n        }\n        role\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetFileById($id: String!, $isPublic: Boolean!) {\n    getFileById(id: $id, isPublic: $isPublic) {\n      id\n      name\n      thumbnail\n      updatedAt\n      whiteboard\n      isPublic\n      userAccess {\n        userId {\n          _id\n          name\n          photo\n          email\n        }\n        role\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateFile {\n    createFile {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateFile {\n    createFile {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateFile($input: UpdateFileInput!) {\n    updateFile(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateFile($input: UpdateFileInput!) {\n    updateFile(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AddNewUserAccess($input: NewUserAccessInput!) {\n    addNewUserAccess(input: $input) {\n      userId {\n        _id\n        name\n        email\n        photo\n      }\n      role\n    }\n  }\n"): (typeof documents)["\n  mutation AddNewUserAccess($input: NewUserAccessInput!) {\n    addNewUserAccess(input: $input) {\n      userId {\n        _id\n        name\n        email\n        photo\n      }\n      role\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ChangeUserAccess($input: ChangeUserAccessInput!) {\n    changeUserAccess(input: $input) {\n      userId {\n        _id\n        name\n        email\n        photo\n      }\n      role\n    }\n  }\n"): (typeof documents)["\n  mutation ChangeUserAccess($input: ChangeUserAccessInput!) {\n    changeUserAccess(input: $input) {\n      userId {\n        _id\n        name\n        email\n        photo\n      }\n      role\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ToogleIsPublic($input: ToogleIsPublicInput!) {\n    toogleIsPublic(input: $input)\n  }\n"): (typeof documents)["\n  mutation ToogleIsPublic($input: ToogleIsPublicInput!) {\n    toogleIsPublic(input: $input)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ToogleFavorite($input: ToogleFavoriteInput!) {\n    toogleFavorite(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation ToogleFavorite($input: ToogleFavoriteInput!) {\n    toogleFavorite(input: $input) {\n      id\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;