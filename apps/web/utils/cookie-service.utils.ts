import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { cookies } from 'next/headers';

const access_token_key = 'access_token';
const refresh_token_key = 'refresh_token';

export const getAccessToken = () => {
  return getCookie(access_token_key);
};

export const setAccessToken = (token: string | null) => {
  return setCookie(access_token_key, token || '');
};

export const removeAccessToken = () => {
  return deleteCookie(access_token_key);
};

export const getRefreshToken = () => {
  return getCookie(refresh_token_key);
};

export const setRefreshToken = (token: string | null) => {
  return setCookie(refresh_token_key, token || '');
};

export const removeRefreshToken = () => {
  return deleteCookie(refresh_token_key);
};
