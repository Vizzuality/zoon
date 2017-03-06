import axios from "axios"
import {errorToErrors} from "./helpers"

export const create = function (path, name) {
  return errorToErrors(axios({
    method: "post",
    url: path,
    data: {name},
  }))
}

export const remove = function (path) {
  return errorToErrors(axios({
    method: "delete",
    url: path,
  }))
}

export const search = (search) => {
  return errorToErrors(axios({
    method: "get",
    url: "/api/tags",
    params: {search},
  }))
}
