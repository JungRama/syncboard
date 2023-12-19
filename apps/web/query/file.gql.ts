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
          email
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
          email
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

export const ADD_NEW_USER_ACCESS_MUTATION = gql(/* GraphQL */ `
  mutation AddNewUserAccess($input: NewUserAccessInput!) {
    addNewUserAccess(input: $input) {
      userId {
        _id
        name
        email
        photo
      }
      role
    }
  }
`);

export const CHANGE_USER_ACCESS_MUTATION = gql(/* GraphQL */ `
  mutation ChangeUserAccess($input: ChangeUserAccessInput!) {
    changeUserAccess(input: $input) {
      userId {
        _id
        name
        email
        photo
      }
      role
    }
  }
`);
