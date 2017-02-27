import "isomorphic-fetch"

export const jsonFetch = function (url, opts) {
  return fetch(url, opts)
    .then((response) => {
      if (response.status === 204) {
        return {}
      }

      return response.json().then((json) => {
        if (json.errors) {
          return { errors: json.errors }
        } else if (json.error) {
          return { errors: { error: [json.error] } }
        } else {
          return json
        }
      })
    })
    .catch((e) => ({ error: [e.message] }))
}
