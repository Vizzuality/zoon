import axios from "axios"

import {errorToErrors} from "./helpers"

export const signIn = (email, password) => errorToErrors(axios({
  method: "post",
  url: "/users/sign_in",
  data: {
    user: {
      email,
      password,
      remember_me: 1,
    },
  },
}))

export const signUp = (user) => errorToErrors(axios({
  method: "post",
  url: "/users",
  data: {user},
}))

export const update = (user) => errorToErrors(axios({
  method: "put",
  url: "/users",
  data: {user},
}))

export const recoverPassword = (email) => errorToErrors(axios({
  method: "post",
  url: "/users/password",
  data: {user: {email}},
}))

export const changePassword = (password, resetPasswordToken) => (
  errorToErrors(axios({
    method: "put",
    url: "/users/password",
    data: {
      user: {
        password,
        reset_password_token: resetPasswordToken,
      },
    },
  }))
)

export const signOut = () => errorToErrors(axios({
  method: "delete",
  url: "/users/sign_out",
}))
