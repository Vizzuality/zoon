import { call, put, takeLatest, select } from 'redux-saga/effects'
import 'isomorphic-fetch';
import buildUrl from 'build-url';
import { push } from 'react-router-redux'

import * as A from '../action_types';
import * as moduleActions from '../actions/modules';
import { exceptionToErrors, errorToErrors } from './helpers'

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
      fetch(buildUrl('/api/modules/'+id), {
        credentials: 'same-origin',
      })
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
        credentials: 'same-origin',
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

function* uploadModuleScreenshot(action) {
  const state = yield select();
  let {screenshotCreatePath, screenshot} = action;

  var formData = new FormData();
  formData.append('screenshot[image]', action.screenshot);

  let json = yield fetch(screenshotCreatePath, {
    method: 'POST',
    credentials: 'same-origin',
    body: formData,
    headers: new Headers({
      'X-CSRF-TOKEN': state.auth.csrf,
      'Accept': 'application/json',
    }),
  }).then((response) => response.json())
    .catch(exceptionToErrors);

  if (json.errors || json.error) {
    yield put(moduleActions.screenshotError(errorToErrors(json)))
  } else {
    yield put(moduleActions.finishModuleFetch(json))
  }
}

function* deleteModuleScreenshot(action) {
  const state = yield select();
  const { screenshotDeletePath } = action;

  let json = yield fetch(action.screenshotDeletePath, {
    method: 'DELETE',
    credentials: 'same-origin',
    headers: new Headers({
      'X-CSRF-TOKEN': state.auth.csrf,
      'Accept': 'application/json',
    }),
  }).then((response) => response.json())
    .catch(exceptionToErrors);

  if (json.errors || json.error) {
    yield put(moduleActions.screenshotError(errorToErrors(json)))
  } else {
    yield put(moduleActions.finishModuleFetch(json))
  }
}

function* createModuleTag(action) {
  const state = yield select();
  let {tagCreatePath, tag} = action;

  let json = yield fetch(tagCreatePath, {
    method: 'POST',
    credentials: 'same-origin',
    body: JSON.stringify({ name: tag }),
    headers: new Headers({
      'X-CSRF-TOKEN': state.auth.csrf,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }),
  }).then((response) => response.json())
    .catch(exceptionToErrors);

  if (json.errors || json.error) {
    yield put(moduleActions.tagError(errorToErrors(json)))
  } else {
    yield put(moduleActions.finishModuleFetch(json))
  }
}

function* deleteModuleTag(action) {
  const state = yield select();
  const { tagDeletePath } = action;

  let json = yield fetch(action.tagDeletePath, {
    method: 'DELETE',
    credentials: 'same-origin',
    headers: new Headers({
      'X-CSRF-TOKEN': state.auth.csrf,
      'Accept': 'application/json',
    }),
  }).then((response) => response.json())
    .catch(exceptionToErrors);

  if (json.errors || json.error) {
    yield put(moduleActions.tagError(errorToErrors(json)))
  } else {
    yield put(moduleActions.finishModuleFetch(json))
  }
}

export default function* modules() {
  yield [
    takeLatest(A.MODULES_UPDATE_SEARCH_QUERY, fetchModulesList),
    takeLatest(A.MODULES_UPDATE_FAMILY_FILTER, fetchModulesList),
    takeLatest(A.MODULES_UPDATE_SEARCH_TAGS, fetchModulesList),
    takeLatest(A.MODULES_UPLOAD_SCREENSHOT, uploadModuleScreenshot),
    takeLatest(A.MODULES_DELETE_SCREENSHOT, deleteModuleScreenshot),
    takeLatest(A.MODULES_CREATE_TAG, createModuleTag),
    takeLatest(A.MODULES_DELETE_TAG, deleteModuleTag),
    takeLatest(A.MODULES_INIT, fetchModulesList),
    takeLatest(A.MODULE_INIT, initModule),
  ];
};
