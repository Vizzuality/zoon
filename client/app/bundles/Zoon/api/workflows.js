import axios from "axios"

import {errorToErrorMessage} from "./helpers"

export const create = (workflow) => errorToErrorMessage(axios({
  method: "post",
  url: "/api/workflows",
  data: {workflow},
}))

export const update = (workflow) => errorToErrorMessage(axios({
  method: "put",
  url: workflow.update_path,
  data: {workflow},
}))

export const remove = (workflow) => errorToErrorMessage(axios({
  method: "delete",
  url: workflow.delete_path,
  data: {workflow},
}))

export const search = (searchQuery = "", selectedGeos = []) => (
  errorToErrorMessage(axios({
    method: "get",
    url: "/api/workflows",
    params: {
      searchQuery,
      selectedGeos: selectedGeos.join(","),
    },
  }))
)

export const get = (id) => errorToErrorMessage(axios({
  method: "get",
  url: `/api/workflows/${id}`,
}))

export const sumitFeedback = (submitFeedbackPath, rating, comment) => (
  errorToErrorMessage(axios({
    method: "post",
    url: submitFeedbackPath,
    data: {feedback: {rating, comment}},
  }))
)
