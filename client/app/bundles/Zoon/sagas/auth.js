import { put, takeLatest } from "redux-saga/effects"
import { push, goBack } from "react-router-redux"

import * as A from "../action_types"
import * as authActions from "../actions/auth"
import * as authAPI from "../api/auth"

function* signIn ({email, password, nextPage}) {
  let result = yield authAPI.signIn(email, password)

  if (result.error) {
    result = {errors: {login: [result.error]}}
  }

  yield put(authActions.authFinished(result))

  if (!result.errors) {
    yield put(authActions.authFinished({nextPage: null}))
    yield put(nextPage && push(nextPage) || goBack())
  }
}

function* signUp ({user}) {
  let result = yield authAPI.signUp(user)

  yield put(authActions.authFinished(result))

  if (!result.errors) {
    yield put(push("/users/sign_in"))
    yield put(authActions.authFinished({
      message: "Siged up successfully! Let's try signing in.",
    }))
  }
}

function* update ({user}) {
  let result = yield authAPI.update(user)

  if (!result.errors) {
    result = {
      message: "Updated successfully!",
      errors: null,
    }
  }

  yield put(authActions.authFinished(result))
}

function* recover ({email}) {
  let result = yield authAPI.recoverPassword(email)

  if (!result.errors) {
    result = {message: "Email sent! Check your inbox."}
  }

  yield put(authActions.authFinished(result))
}

function* changePassword ({password, resetPasswordToken}) {
  let result = yield authAPI.changePassword(password, resetPasswordToken)

  yield put(authActions.authFinished(result))

  if (!result.errors) {
    yield put(push("/users/sign_in"))
    yield put(authActions.authFinished({
      message: "Changed password! Let's try signing in.",
      nextPage: "/",
    }))
  }
}

function* signOut () {
  let result = yield authAPI.signOut()

  yield put(authActions.authLogoutFinished(result))

  if (!result.errors) {
    yield put(push("/"))
  }
}

export default function* modules () {
  yield [
    takeLatest(A.AUTH_LOGIN, signIn),
    takeLatest(A.AUTH_SIGNUP, signUp),
    takeLatest(A.AUTH_UPDATE, update),
    takeLatest(A.AUTH_RECOVER, recover),
    takeLatest(A.AUTH_CHANGE_PASSWORD, changePassword),
    takeLatest(A.AUTH_LOGOUT, signOut),
  ]
};
