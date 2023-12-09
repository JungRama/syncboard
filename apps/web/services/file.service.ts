import { GET_FILES } from '@/query/file.gql';
import { useLazyQuery } from '@apollo/client';

const useFileService = () => {
  const [
    getFiles,
    { loading: loadingGetFiles, error: errorGetFiles, data: dataFiles },
  ] = useLazyQuery(GET_FILES);

  return {
    getFiles,
    loadingGetFiles,
    errorGetFiles,
    dataFiles,
  };
};

export default useFileService;
