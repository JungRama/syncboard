import { gql } from '@apollo/client';

export const SIGN_IN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    loginUser(input: $input) {
      access_token
      refresh_token
    }
  }
`;

export const GET_ME_QUERY = gql`
  query GetMe {
    getMe {
      user {
        createdAt
        email
        id
        name
        updatedAt
      }
    }
  }
`;
