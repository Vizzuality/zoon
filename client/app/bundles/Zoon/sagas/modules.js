import { call, put, takeLatest, select } from 'redux-saga/effects'
import 'isomorphic-fetch';
import buildUrl from 'build-url';
import { push } from 'react-router-redux'

import * as A from '../action_types';


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

function* fetchModulesListFromFamily(action) {
  const state = yield select()
  yield put({
    type: A.MODULES_FETCH_START,
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

    yield put({type: A.MODULES_FETCH_FINISHED, result: json})
  } catch (error) {
    yield put({type: A.MODULES_FETCH_FINISHED, result: {
      state: 'error',
      errorMessage: 'Error talking to the server. ' + error.message,
    }})
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
  ];
};
