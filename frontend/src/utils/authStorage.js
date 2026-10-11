const TOKEN_KEY = "token";
const USER_KEY = "user";

export const getAuthToken = () => sessionStorage.getItem(TOKEN_KEY);

export const getAuthUser = () => {
  try {
    const user = sessionStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const storeAuthSession = (token, user) => {
  clearLegacyAuthStorage();
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearLegacyAuthStorage = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const clearAuthSession = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  clearLegacyAuthStorage();
};
