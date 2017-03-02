import { put, takeLatest, select } from "redux-saga/effects"
import "isomorphic-fetch"

import * as A from "../action_types"
import * as moduleActions from "../actions/modules"
import { exceptionToErrors, errorToErrors } from "./helpers"
import * as moduleAPI from "../api/modules"
import * as tagAPI from "../api/tags"

function* initModule ({id}) {
  try {
    const json = yield (
      fetch(
        "/api/modules/" + id,
        {
          credentials: "same-origin",
        },
      )
      .catch((e) => { throw e })
      .then((r) => r.json())
    )

    yield put(moduleActions.finishModuleFetch(json))
  } catch (error) {
    yield put(moduleActions.finishModuleFetch({
      state: "error",
      errorMessage: "Error talking to the server. " + error.message,
    }))
  }
}

function* modulesFetchList ({searchFamily, searchQuery, searchTags}) {
  const json = yield moduleAPI.searchModules(
    searchFamily || "",
    searchQuery || "",
    searchTags || [],
  )

  if (json.errors) {
    yield put(moduleActions.finishModuleFetch({
      state: "error",
      errorMessage: "Error talking to the server. ",
    }))
  } else {
    yield put(moduleActions.finishModuleFetch(json))
  }
}

function* uploadModuleScreenshot (action) {
  const state = yield select()
  let {screenshotCreatePath, screenshot} = action

  var formData = new FormData()
  formData.append("screenshot[image]", screenshot)

  let json = yield fetch(screenshotCreatePath, {
    method: "POST",
    credentials: "same-origin",
    body: formData,
    headers: new Headers({
      "X-CSRF-TOKEN": state.auth.csrf,
      "Accept": "application/json",
    }),
  }).then((response) => response.json())
    .catch(exceptionToErrors)

  if (json.errors || json.error) {
    yield put(moduleActions.screenshotError(errorToErrors(json)))
  } else {
    yield put(moduleActions.finishModuleFetch(json))
  }
}

function* deleteModuleScreenshot (action) {
  const state = yield select()
  const { screenshotDeletePath } = action

  let json = yield fetch(screenshotDeletePath, {
    method: "DELETE",
    credentials: "same-origin",
    headers: new Headers({
      "X-CSRF-TOKEN": state.auth.csrf,
      "Accept": "application/json",
    }),
  }).then((response) => response.json())
    .catch(exceptionToErrors)

  if (json.errors || json.error) {
    yield put(moduleActions.screenshotError(errorToErrors(json)))
  } else {
    yield put(moduleActions.finishModuleFetch(json))
  }
}

function* createModuleTag (action) {
  const state = yield select()
  let {tagCreatePath, tag} = action

  let json = yield tagAPI.createTag(tagCreatePath, tag, state.auth.csrf)

  if (json.errors || json.error) {
    yield put(moduleActions.tagError(errorToErrors(json)))
  } else {
    yield put(moduleActions.finishModuleFetch(json))
  }
}

function* deleteModuleTag (action) {
  const state = yield select()
  const { tagDeletePath } = action

  let json = yield fetch(tagDeletePath, {
    method: "DELETE",
    credentials: "same-origin",
    headers: new Headers({
      "X-CSRF-TOKEN": state.auth.csrf,
      "Accept": "application/json",
    }),
  }).then((response) => response.json())
    .catch(exceptionToErrors)

  if (json.errors || json.error) {
    yield put(moduleActions.tagError(errorToErrors(json)))
  } else {
    yield put(moduleActions.finishModuleFetch(json))
  }
}

function* submitFeedback (action) {
  const state = yield select()

  var formData = new FormData()
  formData.append("rating", action.rating)
  formData.append("comment", action.comment)

  let json = yield fetch(
    `/api/modules/${action.module.id}/feedback`,
    {
      method: "POST",
      credentials: "same-origin",
      body: formData,
      headers: new Headers({
        "X-CSRF-TOKEN": state.auth.csrf,
        "Accept": "application/json",
      }),
    },
  ).then((r) => r.json())
    .catch(e => ({
      state: "error",
      errorMessage: "Error talking to the server. " + e.message,
    }))

  yield put(moduleActions.submitFeedbackFinished(json))
}

export default function* modules () {
  yield [
    takeLatest(A.MODULES_UPLOAD_SCREENSHOT, uploadModuleScreenshot),
    takeLatest(A.MODULES_DELETE_SCREENSHOT, deleteModuleScreenshot),
    takeLatest(A.MODULES_CREATE_TAG, createModuleTag),
    takeLatest(A.MODULES_DELETE_TAG, deleteModuleTag),
    takeLatest(A.MODULES_FETCH_LIST, modulesFetchList),
    takeLatest(A.MODULE_INIT, initModule),
    takeLatest(A.MODULE_SUBMIT_FEEDBACK, submitFeedback),
  ]
};
