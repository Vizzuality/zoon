export const errorToErrorMessage = (promise) => {
  return promise.then(r => r.data).catch(
    e => e.response && e.response.data || {
      state: "error",
      errorMessage: e.message,
    }
  )
}

export const errorToErrors = (promise) => {
  return promise.then(r => r.data).catch(
    e => e.response && e.response.data || {
      errors: {error: [e.message]},
    }
  )
}
