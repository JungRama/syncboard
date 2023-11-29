import Cookies from 'js-cookie';

const access_token_key = 'access_token';
const refresh_token_key = 'refresh_token';

export const getAccessToken = () => {
  return Cookies.get(access_token_key);
};

export const setAccessToken = (token: string | null) => {
  return Cookies.set(access_token_key, token || '');
};

export const removeAccessToken = () => {
  return Cookies.remove(access_token_key);
};

export const getRefreshToken = () => {
  return Cookies.get(refresh_token_key);
};

export const setRefreshToken = (token: string | null) => {
  return Cookies.set(refresh_token_key, token || '');
};

export const removeRefreshToken = () => {
  return Cookies.remove(refresh_token_key);
};
