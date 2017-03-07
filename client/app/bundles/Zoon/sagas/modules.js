import { eventChannel, END } from "redux-saga"
import { fork, put, take, takeLatest } from "redux-saga/effects"

import * as A from "../action_types"
import * as moduleActions from "../actions/modules"
import * as moduleAPI from "../api/modules"
import * as tagAPI from "../api/tags"

function* initModule ({id}) {
  const json = yield moduleAPI.fetchModule(id)
  yield put(moduleActions.finishModuleFetch(json))
}

function* searchModules ({searchFamily, searchQuery, selectedGeos}) {
  const json = yield moduleAPI.searchModules(
    searchFamily,
    searchQuery,
    selectedGeos,
  )
  yield put(moduleActions.finishModuleFetch(json))
}

function* uploadScreenshot ({screenshotCreatePath, screenshot}) {
  // Have a subsaga dispatching progresses
  let emit
  const chan = eventChannel(emitter => {
    emit = emitter
    return () => {}
  })
  yield fork(
    function* () {
      while (true) {
        const data = yield take(chan)
        yield put(moduleActions.screenshotUploadProgress(data))
      }
    },
  )

  let json = yield moduleAPI.uploadScreenshot(
    screenshotCreatePath,
    screenshot,
    emit,
  ).then(r => { emit(END); return r })

  if (json.errors || json.error) {
    yield put(moduleActions.screenshotError(json))
  } else {
    yield put(moduleActions.finishModuleFetch(json))
  }
}

function* deleteScreenshot ({screenshotDeletePath}) {
  let json = yield moduleAPI.deleteScreenshot(screenshotDeletePath)

  if (json.errors || json.error) {
    yield put(moduleActions.screenshotError(json))
  } else {
    yield put(moduleActions.finishModuleFetch(json))
  }
}

function* createModuleTag ({tagCreatePath, tag}) {
  let json = yield tagAPI.create(tagCreatePath, tag)

  if (json.errors || json.error) {
    yield put(moduleActions.tagError(json))
  } else {
    yield put(moduleActions.finishModuleFetch(json))
  }
}

function* deleteModuleTag ({tagDeletePath}) {
  const json = yield tagAPI.remove(tagDeletePath)

  if (json.errors || json.error) {
    yield put(moduleActions.tagError(json))
  } else {
    yield put(moduleActions.finishModuleFetch(json))
  }
}

function* submitFeedback ({path, rating, comment}) {
  const json = yield moduleAPI.submitFeedback(path, rating, comment)

  yield put(moduleActions.submitFeedbackFinished(json))
}

export default function* modules () {
  yield [
    takeLatest(A.MODULES_UPLOAD_SCREENSHOT, uploadScreenshot),
    takeLatest(A.MODULES_DELETE_SCREENSHOT, deleteScreenshot),
    takeLatest(A.MODULES_CREATE_TAG, createModuleTag),
    takeLatest(A.MODULES_DELETE_TAG, deleteModuleTag),
    takeLatest(A.MODULES_FETCH_LIST, searchModules),
    takeLatest(A.MODULE_INIT, initModule),
    takeLatest(A.MODULE_SUBMIT_FEEDBACK, submitFeedback),
  ]
};
