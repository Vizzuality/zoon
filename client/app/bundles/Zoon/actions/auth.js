import * as A from '../action_types';

export const authLogin = (email, password) => ({
  type: A.AUTH_LOGIN,
  email,
  password,
});

export const authSignup = (user) => ({
  type: A.AUTH_SIGNUP,
  user,
});

export const authUpdate = (user) => ({
  type: A.AUTH_UPDATE,
  user,
});

export const authFinished = (payload) => ({
  type: A.AUTH_FINISHED,
  payload,
});

export const authLogout = () => ({
  type: A.AUTH_LOGOUT,
});

export const authLogoutFinished = (payload) => ({
  type: A.AUTH_LOGOUT_FINISHED,
  payload,
});
