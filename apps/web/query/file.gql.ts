import { gql } from '@/codegen/gql';

export const GET_FILES_QUERY = gql(/* GraphQL */ `
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

export const CREATE_FILE_MUTATION = gql(/* GraphQL */ `
  mutation CreateFile {
    createFile {
      id
    }
  }
`);
