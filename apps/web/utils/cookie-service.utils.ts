import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { OptionsType } from 'cookies-next/lib/types';

const access_token_key = 'access_token';
const refresh_token_key = 'refresh_token';
const open_ai_api_key = 'open_ai_api_key';

const accessTokenOptions: OptionsType = {
  maxAge: 60 * 60 * 24, // 1 days
  sameSite: 'lax',
  secure: true,
  path: '/',
};

const refreshTokenOptions: OptionsType = {
  maxAge: 60 * 60 * 24 * 30, // 30 days
  sameSite: 'lax',
  secure: true,
  path: '/',
};

const openAiTokenOptions: OptionsType = {
  maxAge: 60 * 60 * 24 * 30, // 30 days
  sameSite: 'lax',
  secure: true,
  path: '/',
};

export const getAccessToken = () => {
  return getCookie(access_token_key);
};

export const setAccessToken = (token: string | null) => {
  return setCookie(access_token_key, token || '', accessTokenOptions);
};

export const removeAccessToken = () => {
  return deleteCookie(access_token_key);
};

export const getRefreshToken = () => {
  return getCookie(refresh_token_key);
};

export const setRefreshToken = (token: string | null) => {
  return setCookie(refresh_token_key, token || '', refreshTokenOptions);
};

export const removeRefreshToken = () => {
  return deleteCookie(refresh_token_key);
};

export const getOpenAIKey = () => {
  return getCookie(open_ai_api_key);
};

export const setOpenAIKey = (key: string | null) => {
  return setCookie(open_ai_api_key, key || '', openAiTokenOptions);
};

export const removeOpenAIKey = () => {
  return deleteCookie(open_ai_api_key);
};
