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

export const uploadScreenshot = (moduleId, screenshot) => ({
  type: A.MODULES_UPLOAD_SCREENSHOT,
  moduleId,
  screenshot,
});

export const deleteScreenshot = (moduleId, screenshotId) => ({
  type: A.MODULES_DELETE_SCREENSHOT,
  moduleId,
  screenshotId,
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
