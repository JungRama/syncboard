import {
  ADD_NEW_USER_ACCESS_MUTATION,
  CHANGE_USER_ACCESS_MUTATION,
  CREATE_FILE_MUTATION,
  GET_FILES_QUERY,
  GET_FILE_BY_ID_QUERY,
  UPDATE_FILE_MUTATION,
} from '@/query/file.gql';
import { useMutation, useQuery } from '@apollo/client';

export const getFiles = (search: string | null) => {
  return useQuery(GET_FILES_QUERY, {
    variables: {
      search: search ?? undefined,
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });
};

export const getFileById = (id: string) => {
  return useQuery(GET_FILE_BY_ID_QUERY, {
    variables: {
      id,
    },
  });
};

export const mutateCreateFile = () => {
  return useMutation(CREATE_FILE_MUTATION);
};

export const mutateUpdateFile = () => {
  return useMutation(UPDATE_FILE_MUTATION);
};

export const mutateAddNewUserAccess = () => {
  return useMutation(ADD_NEW_USER_ACCESS_MUTATION);
};

export const mutateChangeUserAccess = () => {
  return useMutation(CHANGE_USER_ACCESS_MUTATION);
};

// export const useFileService = () => {
//   const [
//     getFiles,
//     { loading: loadingGetFiles, error: errorGetFiles, data: dataFiles },
//   ] = useLazyQuery(GET_FILES_QUERY);

//   const [
//     mutateCreateFile,
//     { loading: loadingCreateFile, error: errorCreateFile },
//   ] = useMutation(CREATE_FILE_MUTATION);

//   const [
//     mutateUpdateFile,
//     { loading: loadingUpdateFile, error: errorUpdateFile },
//   ] = useMutation(UPDATE_FILE_MUTATION);

//   return {
//     getFiles,
//     loadingGetFiles,
//     errorGetFiles,
//     dataFiles,

//     getFileById,

//     mutateCreateFile,
//     loadingCreateFile,
//     errorCreateFile,

//     mutateUpdateFile,
//     loadingUpdateFile,
//     errorUpdateFile,
//   };
// };

// export default useFileService;
