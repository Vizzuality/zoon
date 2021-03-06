import * as A from "../action_types"

export const modulesFetchList = ({searchFamily, searchQuery, selectedGeos}) => ({
  type: A.MODULES_FETCH_LIST,
  searchFamily,
  searchQuery,
  selectedGeos,
})

export const finishModuleFetch = (result) => ({
  type: A.MODULES_FETCH_FINISHED,
  result,
})

export const uploadScreenshot = (screenshotCreatePath, screenshot) => ({
  type: A.MODULES_UPLOAD_SCREENSHOT,
  screenshotCreatePath,
  screenshot,
})

export const deleteScreenshot = (screenshotDeletePath) => ({
  type: A.MODULES_DELETE_SCREENSHOT,
  screenshotDeletePath,
})

export const createTag = (tagCreatePath, tag) => ({
  type: A.MODULES_CREATE_TAG,
  tagCreatePath,
  tag,
})

export const deleteTag = (tagDeletePath) => ({
  type: A.MODULES_DELETE_TAG,
  tagDeletePath,
})

export const tagError = (errors) => ({
  type: A.TAG_ERROR,
  errors,
})

export const screenshotError = (errors) => ({
  type: A.SCREENSHOT_ERROR,
  errors,
})

export const clearModules = () => ({
  type: A.MODULES_CLEAR,
})

export const initModule = (id) => ({
  type: A.MODULE_INIT,
  id,
})

export const clearModule = () => ({
  type: A.MODULE_CLEAR,
})

export const submitFeedback = (path, rating, comment) => ({
  type: A.MODULE_SUBMIT_FEEDBACK,
  path,
  rating,
  comment,
})

export const submitFeedbackFinished = (result) => ({
  type: A.MODULE_SUBMIT_FEEDBACK_FINISHED,
  result,
})

export const screenshotUploadProgress = (percentage) => ({
  type: A.MODULE_SCREENSHOT_UPLOAD_PROGRESS,
  percentage,
})
