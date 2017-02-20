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

function* initModule({id}) {
  try {
    const json = yield (
      fetch(buildUrl('/api/modules/'+id))
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
}

function* fetchModulesList() {
  const state = yield select()
  let {searchFamily, searchQuery, granularity, searchTags} = state.modules;

  try {
    const json = yield (
      fetch(buildUrl('/api/modules', {
        queryParams: {searchFamily, searchQuery, searchTags}
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
      queryParams: filterEmptyValues({searchFamily, searchQuery, granularity, searchTags})
    })
  ))
}

export default function* modules() {
  yield [
    takeLatest(A.MODULES_UPDATE_SEARCH_QUERY, fetchModulesList),
    takeLatest(A.MODULES_UPDATE_FAMILY_FILTER, fetchModulesList),
    takeLatest(A.MODULES_UPDATE_SEARCH_TAGS, fetchModulesList),
    takeLatest(A.MODULES_INIT, fetchModulesList),
    takeLatest(A.MODULE_INIT, initModule),
  ];
};
