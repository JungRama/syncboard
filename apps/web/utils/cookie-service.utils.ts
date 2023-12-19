import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { cookies } from 'next/headers';

const access_token_key = 'access_token';
const refresh_token_key = 'refresh_token';
const open_ai_api_key = 'open_ai_api_key';

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

export const getOpenAIKey = () => {
  return getCookie(open_ai_api_key);
};

export const setOpenAIKey = (key: string | null) => {
  return setCookie(open_ai_api_key, key || '');
};

export const removeOpenAIKey = () => {
  return deleteCookie(open_ai_api_key);
};
