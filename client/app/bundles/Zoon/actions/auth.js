import * as A from '../action_types';

export const authLogin = (authenticityToken, email, password) => ({
  type: A.AUTH_LOGIN,
  authenticityToken,
  email,
  password,
});

export const authSignup = (authenticityToken, user) => ({
  type: A.AUTH_SIGNUP,
  authenticityToken,
  user,
});

export const authFinished = (payload) => ({
  type: A.AUTH_FINISHED,
  payload,
});

export const authLogout = (authenticityToken) => ({
  type: A.AUTH_LOGOUT,
  authenticityToken,
});

export const authLogoutFinished = (payload) => ({
  type: A.AUTH_LOGOUT_FINISHED,
  payload,
});
