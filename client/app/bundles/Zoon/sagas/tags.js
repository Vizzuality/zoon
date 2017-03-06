import { call, put, takeLatest } from "redux-saga/effects"
import { delay } from "redux-saga"

import * as A from "../action_types"
import * as tagActions from "../actions/tags"
import * as tagAPI from "../api/tags"
import * as moduleActions from "../actions/modules"

function* formChange ({name}) {
  if (name === "") {
    yield put(tagActions.autoComplete(name, []))
    return
  }

  yield call(delay, 500)

  let json = yield tagAPI.search(name)

  if (json.errors || json.error) {
    yield put(moduleActions.tagError(json))
  } else {
    yield put(tagActions.autoComplete(name, json.tags))
  }
}

export default function* tags () {
  yield [
    takeLatest(A.TAG_FORM_CHANGE, formChange),
  ]
};
