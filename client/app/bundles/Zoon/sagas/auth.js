import { call, put, takeLatest, select } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { goBack } from 'react-router-redux'
import 'isomorphic-fetch';

import * as A from '../action_types';
import * as authActions from '../actions/auth';


function* signIn({email, password}) {
  let state = yield select();

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
      'X-CSRF-Token': state.auth.csrf,
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

function* signUp({user}) {
  let state = yield select();

  let result = yield fetch('/users', {
    method: 'POST',
    credentials: "same-origin",
    body: JSON.stringify({ user }),
    headers: new Headers({
      'X-CSRF-Token': state.auth.csrf,
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

function* update({user}) {
  let state = yield select();

  let result = yield fetch('/users', {
    method: 'PUT',
    credentials: "same-origin",
    body: JSON.stringify({ user }),
    headers: new Headers({
      'X-CSRF-Token': state.auth.csrf,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }),
  }).then((response) => {
    if (response.ok) {
      let updatedUser = {...user};
      delete updatedUser.current_password;
      return updatedUser;
    } else {
      return response.json();
    }
  }).catch((e) => ({ errors: {error: [e.message]} }));

  yield put(authActions.authFinished({ ...result }));
}

function* signOut() {
  let state = yield select();

  let result = yield fetch('/users/sign_out', {
    method:'DELETE',
    credentials: 'same-origin',
    headers: new Headers({
      'X-CSRF-Token': state.auth.csrf,
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
    takeLatest(A.AUTH_UPDATE, update),
    takeLatest(A.AUTH_LOGOUT, signOut),
  ];
};
