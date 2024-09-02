const ACCESS_TOKEN_KEY = "access_token" as string;
const REFRESH_TOKEN_KEY = "refresh_token" as string;
import axios from "axios";

/**
 * @description get token form localStorage
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * @description save token into localStorage
 * @param token: string
 */
export const saveAccessToken = (token: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const saveRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export const refreshToken = async () => {
  const refreshToken = getRefreshToken();
  const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/silque_user/auth/obtain_token/`, {
    refresh: refreshToken,
  });
  const newAccessToken = response.data.access;
  saveAccessToken(newAccessToken);
  return newAccessToken;
}

/**
 * @description remove token form localStorage
 */
export const destroyTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export default { 
  getAccessToken, getRefreshToken, 
  saveAccessToken, saveRefreshToken,
  refreshToken, destroyTokens 
};
