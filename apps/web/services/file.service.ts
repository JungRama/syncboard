import { CREATE_FILE_MUTATION, GET_FILES_QUERY } from '@/query/file.gql';
import { useLazyQuery, useMutation } from '@apollo/client';

const useFileService = () => {
  const [
    getFiles,
    { loading: loadingGetFiles, error: errorGetFiles, data: dataFiles },
  ] = useLazyQuery(GET_FILES_QUERY);

  const [
    mutateCreateFile,
    { loading: loadingCreateFile, error: errorCreateFile },
  ] = useMutation(CREATE_FILE_MUTATION);

  return {
    getFiles,
    loadingGetFiles,
    errorGetFiles,
    dataFiles,

    mutateCreateFile,
    loadingCreateFile,
    errorCreateFile,
  };
};

export default useFileService;
