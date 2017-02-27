import { jsonFetch } from "./helpers"

export const createTag = function (path, tagname, csrf) {
  return jsonFetch(path, {
    method: "POST",
    credentials: "same-origin",
    body: JSON.stringify({ name: tagname }),
    headers: new Headers({
      "X-CSRF-TOKEN": csrf,
      "Content-Type": "application/json",
      "Accept": "application/json",
    }),
  })
}

export const deleteTag = function (path, csrf) {
  return jsonFetch(path, {
    method: "DELETE",
    credentials: "same-origin",
    headers: new Headers({
      "X-CSRF-TOKEN": csrf,
      "Content-Type": "application/json",
      "Accept": "application/json",
    }),
  })
}
