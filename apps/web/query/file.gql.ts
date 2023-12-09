import { gql } from '@/codegen/gql';

export const GET_FILES = gql(/* GraphQL */ `
  query GetFiles($search: String) {
    getFiles(search: $search) {
      name
      thumbnail
      updatedAt
      userAccess {
        userId {
          _id
          name
          photo
        }
        role
      }
    }
  }
`);
