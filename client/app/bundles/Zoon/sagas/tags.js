import { call, put, takeLatest, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import 'isomorphic-fetch';
import buildUrl from 'build-url';
import { push } from 'react-router-redux'

import * as A from '../action_types';
import * as tagActions from '../actions/tags';
import * as moduleActions from '../actions/modules';
import { exceptionToErrors, errorToErrors } from './helpers'


function* formChange(action) {
  yield call(delay, 500);

  const state = yield select();
  const { name } = action;

  let json = yield fetch(
    buildUrl(
      "/api/tags",
      { queryParams: { search: action.name } },
    ),
    {
      method: 'GET',
      credentials: 'same-origin',
      headers: new Headers({
        'X-CSRF-TOKEN': state.auth.csrf,
        'Accept': 'application/json',
      }),
    }
  ).then((response) => response.json())
    .catch(exceptionToErrors);

  if (json.errors || json.error) {
    yield put(moduleActions.tagError(errorToErrors(json)))
  } else {
    yield put(tagActions.autoComplete(json.tags))
  }
}


export default function* tags() {
  yield [
    takeLatest(A.TAG_FORM_CHANGE, formChange),
  ];
};
