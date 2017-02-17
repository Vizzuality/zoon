import * as A from '../action_types';

export const fetchModuleList = (familyName, searchQuery, pageNumber=0) => ({
  type: A.MODULES_FETCH_START,
  familyName,
  searchQuery,
  pageNumber,
});

export const updateSearchQuery = (newQuery) => ({
  type: A.MODULES_UPDATE_SEARCH_QUERY,
  newQuery,
});

export const updateFamilyFilter = (newFamilyName) => ({
  type: A.MODULES_UPDATE_FAMILY_FILTER,
  newFamilyName,
});
