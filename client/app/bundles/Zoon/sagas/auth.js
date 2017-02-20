import { call, put, takeLatest, select } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { goBack } from 'react-router-redux'
import 'isomorphic-fetch';

import * as A from '../action_types';
import * as authActions from '../actions/auth';


function* signIn({authenticityToken, email, password}) {
  let result = yield fetch('/users/sign_in', {
    method: 'POST',
    credentials: "same-origin",
    body: JSON.stringify({
      user: {
        email,
        password,
        remember_me: 1,
      },
    }),
    headers: new Headers({
      'X-CSRF-Token': authenticityToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }),
  }).then((response) => {
    if (response.ok) {
      return response.json().then((json) => ({
        ...json,
        csrf: response.headers.get('X-CSRF-Token'),
      }));
    } else {
      return response.json().then((json) => ({
        errors: {login: [json.error]},
      }));
    }
  }).catch((e) => ({ errors: {error: [e.message]} }));

  yield put(authActions.authFinished({ ...result }));

  if (!result.errors) {
    yield put(goBack());
  }
}

function* signUp({authenticityToken, user}) {
  let result = yield fetch('/users', {
    method: 'POST',
    credentials: "same-origin",
    body: JSON.stringify({ user }),
    headers: new Headers({
      'X-CSRF-Token': authenticityToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }),
  }).then((response) => {
    if (response.ok) {
      return response.json().then((json) => ({
        ...json,
        csrf: response.headers.get('X-CSRF-Token'),
      }));
    } else {
      return response.json();
    }
  }).catch((e) => ({ errors: {error: [e.message]} }));

  yield put(authActions.authFinished({ ...result }));

  if (!result.errors) {
    yield put(push('/'));
  }
}

function* signOut({authenticityToken}) {
  let result = yield fetch('/users/sign_out', {
    method:'DELETE',
    credentials: 'same-origin',
    headers: new Headers({
      'X-CSRF-Token': authenticityToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }),
  }).then((response) => {
    if (response.ok) {
      return {
        csrf: response.headers.get('X-CSRF-Token'),
      }
    } else {
      return {}
    }
  }).catch((e) => ({ error: e.message }));

  yield put(authActions.authLogoutFinished({ ...result }));

  if (!result.error) {
    yield put(push('/'));
  }
}

export default function* modules() {
  yield [
    takeLatest(A.AUTH_LOGIN, signIn),
    takeLatest(A.AUTH_SIGNUP, signUp),
    takeLatest(A.AUTH_LOGOUT, signOut),
  ];
};
