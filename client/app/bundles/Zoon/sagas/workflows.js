import { put, takeLatest, select } from "redux-saga/effects"
import { push } from "react-router-redux"

import * as A from "../action_types"
import * as workflowActions from "../actions/workflows"
import * as moduleActions from "../actions/modules"
import * as workflowAPI from "../api/workflows"
import * as moduleAPI from "../api/modules"
import * as tagAPI from "../api/tags"

function* create ({workflow}) {
  let json = yield workflowAPI.create(workflow)

  if (json.errors) {
    yield put(workflowActions.finishWorkflowFetch({
      state: "error",
      errors: json.errors,
    }))
  } else {
    yield put(push(`/workflows/${json.workflow.id}`))
  }
}

function* update ({workflow}) {
  let json = yield workflowAPI.update(workflow)

  if (json.errors) {
    yield put(workflowActions.finishWorkflowFetch({
      state: "error",
      errors: json.errors,
    }))
  } else {
    yield put(push(`/workflows/${json.workflow.id}`))
  }
}

function* remove ({workflow}) {
  let json = yield workflowAPI.remove(workflow)

  if (json.errors) {
    yield put(workflowActions.finishWorkflowFetch({
      state: "error",
      errorMessage: json.errors,
    }))
  } else {
    const state = yield select()
    yield put(workflowActions.finishWorkflowFetch({
      state: "ok",
      entities: state.workflows.entities.filter((w) => w.id !== workflow.id),
    }))
  }
}

function* searchModules ({family}) {
  const json = yield moduleAPI.searchModules(family)
  yield put(moduleActions.finishModuleFetch(json))
}

function* search ({searchQuery, selectedGeos}) {
  const json = yield workflowAPI.search(searchQuery, selectedGeos)

  if (json.errors) {
    yield put(workflowActions.finishWorkflowFetch({
      state: "error",
      errorMessage: "Error talking to the server.",
    }))
  } else {
    yield put(workflowActions.finishWorkflowFetch({
      state: "ok",
      ...json,
    }))
  }
}

function* get ({id}) {
  const json = yield workflowAPI.get(id)

  if (json.errors) {
    yield put(workflowActions.finishWorkflowFetch({
      state: "error",
      errorMessage: "Error talking to the server.",
    }))
  } else {
    yield put(workflowActions.finishWorkflowFetch({
      state: "ok",
      entities: [json.workflow],
    }))
  }
}

function* createTag ({tagCreatePath, tag}) {
  let json = yield tagAPI.create(tagCreatePath, tag)

  if (json.errors) {
    yield put(moduleActions.tagError(json.errors))
  } else {
    yield put(workflowActions.finishWorkflowFetch({
      state: "ok",
      entities: [json.workflow],
    }))
  }
}

function* deleteTag ({tagDeletePath}) {
  let json = yield tagAPI.remove(tagDeletePath)

  if (json.errors) {
    yield put(moduleActions.tagError(json.errors))
  } else {
    yield put(workflowActions.finishWorkflowFetch({
      state: "ok",
      entities: [json.workflow],
    }))
  }
}

function* sumitFeedback ({path, rating, comment}) {
  let json = yield workflowAPI.sumitFeedback(path, rating, comment)

  if (json.errors) {
    yield put(workflowActions.submitFeedbackFinished({
      state: "ok",
      errorMessage: "Error talking to the server.",
    }))
  } else {
    yield put(workflowActions.submitFeedbackFinished({
      state: "ok",
      entities: [json.workflow],
    }))
  }
}

export default function* modules () {
  yield [
    takeLatest(A.WORKFLOW_CREATE, create),
    takeLatest(A.WORKFLOW_UPDATE, update),
    takeLatest(A.WORKFLOW_DELETE, remove),
    takeLatest(A.WORKFLOW_SEARCH_MODULES, searchModules),
    takeLatest(A.WORKFLOWS_FETCH_LIST, search),
    takeLatest(A.WORKFLOW_INIT, get),
    takeLatest(A.WORKFLOW_CREATE_TAG, createTag),
    takeLatest(A.WORKFLOW_DELETE_TAG, deleteTag),
    takeLatest(A.WORKFLOW_SUBMIT_FEEDBACK, sumitFeedback),
  ]
};
