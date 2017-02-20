import * as A from '../action_types';

export const finishModuleFetch = (result) => ({
  type: A.MODULES_FETCH_FINISHED,
  result,
});

export const updateSearchQuery = (newQuery) => ({
  type: A.MODULES_UPDATE_SEARCH_QUERY,
  newQuery,
});

export const updateSearchTags = (granularity, searchTags) => ({
  type: A.MODULES_UPDATE_SEARCH_TAGS,
  granularity,
  searchTags,
});

export const updateFamilyFilter = (newFamilyName) => ({
  type: A.MODULES_UPDATE_FAMILY_FILTER,
  newFamilyName,
});

export const uploadScreenshot = (screenshotCreatePath, screenshot) => ({
  type: A.MODULES_UPLOAD_SCREENSHOT,
  screenshotCreatePath,
  screenshot,
});

export const deleteScreenshot = (screenshotDeletePath) => ({
  type: A.MODULES_DELETE_SCREENSHOT,
  screenshotDeletePath,
});

export const createTag = (tagCreatePath, tag) => ({
  type: A.MODULES_CREATE_TAG,
  tagCreatePath,
  tag,
});

export const deleteTag = (tagDeletePath) => ({
  type: A.MODULES_DELETE_TAG,
  tagDeletePath,
});

export const tagError = (errors) => ({
  type: A.TAG_ERROR,
  errors,
});

export const screenshotError = (errors) => ({
  type: A.SCREENSHOT_ERROR,
  errors,
});

export const initModules = () => ({
  type: A.MODULES_INIT,
});

export const clearModules = () => ({
  type: A.MODULES_CLEAR,
});

export const initModule = (id) => ({
  type: A.MODULE_INIT,
  id,
});

export const clearModule = () => ({
  type: A.MODULE_CLEAR,
});

export const submitFeedback = (moduleId, rating, comment) => ({
  type: A.MODULE_SUBMIT_FEEDBACK,
  moduleId,
  rating,
  comment,
});

export const submitFeedbackFinished = (result) => ({
  type: A.MODULE_SUBMIT_FEEDBACK_FINISHED,
  result,
});
