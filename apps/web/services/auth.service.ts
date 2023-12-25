import {
  GET_ME_QUERY,
  LOGOUT_QUERY,
  OAUTH_MUTATION,
  SIGN_IN_MUTATION,
  SIGN_UP_MUTATION,
  VERIFY_ACCOUNT_MUTATION,
} from '@/query/auth.gql';
import { useLazyQuery, useMutation } from '@apollo/client';

const useAuthService = () => {
  const [mutateLogin, { loading: loadingLogin, error: errorLogin }] =
    useMutation(SIGN_IN_MUTATION);

  const [mutateOAuth, { loading: loadingOAuth, error: errorOAuth }] =
    useMutation(OAUTH_MUTATION);

  const [
    mutateVerifyAccount,
    { loading: loadingVerifyAccount, error: errorVerifyAccount },
  ] = useMutation(VERIFY_ACCOUNT_MUTATION);

  const [mutateRegister, { loading: loadingRegister, error: errorRegister }] =
    useMutation(SIGN_UP_MUTATION);

  const [getMe, { loading: loadingGetMe, error: errorGetMe }] =
    useLazyQuery(GET_ME_QUERY);

  const [logout, { loading: loadingLogout, error: errorLogout }] =
    useLazyQuery(LOGOUT_QUERY);

  return {
    mutateLogin,
    loadingLogin,
    errorLogin,

    mutateOAuth,
    loadingOAuth,
    errorOAuth,

    mutateVerifyAccount,
    loadingVerifyAccount,
    errorVerifyAccount,

    mutateRegister,
    loadingRegister,
    errorRegister,

    getMe,
    loadingGetMe,
    errorGetMe,

    logout,
    loadingLogout,
    errorLogout,
  };
};

export default useAuthService;
