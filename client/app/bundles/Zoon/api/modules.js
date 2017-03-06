import axios from "axios"
import {errorToErrorMessage} from "./helpers"

export const fetchModule = (id) => errorToErrorMessage(axios({
  method: "get",
  url: "/api/modules/" + id,
}))

export const searchModules = (
  searchFamily = "",
  searchQuery = "",
  selectedGeos = [],
) => errorToErrorMessage(axios({
  method: "get",
  url: "/api/modules",
  params: {searchFamily, searchQuery, selectedGeos},
}))

export const uploadScreenshot = (
  createPath,
  image,
) => {
  const formData = new FormData()
  formData.append("screenshot[image]", image)

  return errorToErrorMessage(axios({
    method: "post",
    url: createPath,
    data: formData,
  }))
}

export const deleteScreenshot = (deletePath) => errorToErrorMessage(axios({
  method: "delete",
  url: deletePath,
}))

export const submitFeedback = (path, rating, comment) => (
  errorToErrorMessage(axios({
    method: "post",
    url: path,
    data: {rating, comment},
  }))
)
