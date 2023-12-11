import { removeAccessToken, removeRefreshToken } from './cookie-service.utils';

export const clearAllCredentials = (redirect?: string) => {
  removeAccessToken();
  removeRefreshToken();
  if (redirect) {
    window.location.href = redirect;
  }
};
