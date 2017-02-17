import { call, put, takeLatest, select } from 'redux-saga/effects'
import 'isomorphic-fetch';
import buildUrl from 'build-url';
import { push } from 'react-router-redux'

import * as A from '../action_types';
import * as moduleActions from '../actions/modules';


function filterEmptyValues(obj){
  let result = {};
  for (var k in obj) {
    if (obj[k] === null || obj[k] === undefined || obj[k] === '') {
      continue
    }
    result[k] = obj[k]
  }
  return result
}

function* init(action) {
  const state = yield select()
  const q = state.routing.locationBeforeTransitions.query
  const familyName = q.familyName || '';
  const searchQuery = q.searchQuery || '';

  yield put(moduleActions.updateFamilyFilter(familyName))

  yield put(moduleActions.updateSearchQuery(searchQuery))

  yield put(moduleActions.fetchModuleList(familyName, searchQuery))
}

function* fetchModulesListFromFamily(action) {
  const state = yield select()
  yield fetchModulesList({
    familyName: action.newFamilyName,
    searchQuery: state.modules.searchQuery,
  })
}

function* fetchModulesList({familyName, searchQuery}) {
  try {
    const json = yield (
      fetch(buildUrl('/api/modules', {
        queryParams: {familyName, searchQuery}
      }))
      .catch((e) => {throw e})
      .then((r) => r.json())
    );

    yield put(moduleActions.finishModuleFetch(json))
  } catch (error) {
    yield put(moduleActions.finishModuleFetch({
      state: 'error',
      errorMessage: 'Error talking to the server. ' + error.message,
    }))
  }

  yield put(push(
    buildUrl('/modules', {
      queryParams: filterEmptyValues({familyName, searchQuery})
    })
  ))
}

export default function* modules() {
  yield [
    takeLatest(A.MODULES_FETCH_START, fetchModulesList),
    takeLatest(A.MODULES_UPDATE_FAMILY_FILTER, fetchModulesListFromFamily),
    takeLatest(A.MODULES_INIT, init),
  ];
};
