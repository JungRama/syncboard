import { gql } from '@/codegen/gql';

export const GET_FILES_QUERY = gql(/* GraphQL */ `
  query GetFiles($search: String) {
    getFiles(search: $search) {
      id
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

export const GET_FILE_BY_ID_QUERY = gql(/* GraphQL */ `
  query GetFileById($id: String!) {
    getFileById(id: $id) {
      id
      name
      thumbnail
      updatedAt
      whiteboard
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

export const UPDATE_FILE_MUTATION = gql(/* GraphQL */ `
  mutation UpdateFile($input: UpdateFileInput!) {
    updateFile(input: $input) {
      id
    }
  }
`);
