import { call, put, takeLatest, select } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import * as A from '../action_types';
import * as workflowActions from '../actions/workflows';
import * as moduleActions from '../actions/modules';
import * as workflowAPI from '../api/workflows';
import * as moduleAPI from '../api/modules';
import * as tagAPI from '../api/tags';


function* createWorkflow(action) {
  const state = yield select();

  let json = yield workflowAPI.createWorkflow(
    action.workflow,
    state.auth.csrf,
  );

  if (json.errors) {
    yield put(workflowActions.finishWorkflowFetch({
      state: 'error',
      errors: json.errors,
    }));
  } else {
    yield put(push(`/workflows/${json.workflow.id}`));
  }
}

function* searchModules(action) {
  const json = yield moduleAPI.searchModules(action.family, "", []);

  if (json.errors) {
  } else {
    yield put(moduleActions.finishModuleFetch(json))
  }
}

function* initWorkflows(action) {
  const state = yield select();

  const json = yield workflowAPI.listWorkflows(state.auth.csrf);

  if (json.errors) {
    yield put(workflowActions.finishWorkflowFetch({
      state: 'error',
      errorMessage: 'Error talking to the server.',
    }));
  } else {
    yield put(workflowActions.finishWorkflowFetch({
      state: 'ok',
      ...json,
    }))
  }
}

function* initWorkflow(action) {
  const state = yield select();

  const json = yield workflowAPI.getWorkflow(action.id, state.auth.csrf);

  if (json.errors) {
    yield put(workflowActions.finishWorkflowFetch({
      state: 'error',
      errorMessage: 'Error talking to the server.',
    }));
  } else {
    yield put(workflowActions.finishWorkflowFetch({
      state: 'ok',
      entities: [json.workflow],
    }))
  }
}

function* createWorkflowTag(action) {
  const state = yield select();
  let { tagCreatePath, tag } = action;

  let json = yield tagAPI.createTag(tagCreatePath, tag, state.auth.csrf);

  if (json.errors) {
    yield put(moduleActions.tagError(json.errors));
  } else {
    yield put(workflowActions.finishWorkflowFetch({
      state: 'ok',
      entities: [json.workflow],
    }))
  }
}

function* deleteWorkflowTag(action) {
  const state = yield select();
  let { tagDeletePath, tag } = action;

  let json = yield tagAPI.deleteTag(tagDeletePath, state.auth.csrf);

  if (json.errors) {
    yield put(moduleActions.tagError(json.errors));
  } else {
    yield put(workflowActions.finishWorkflowFetch({
      state: 'ok',
      entities: [json.workflow],
    }))
  }
}

function* submitWorkflowFeedback(action) {
  const state = yield select();

  let json = yield workflowAPI.submitWorkflowFeedback(
    action.workflow,
    {
      rating: action.rating,
      comment: action.comment,
    },
    state.auth.csrf,
  );

  if (json.errors) {
    yield put(workflowActions.submitFeedbackFinished({
      state: 'ok',
      errorMessage: 'Error talking to the server.',
    }))
  } else {
    yield put(workflowActions.submitFeedbackFinished({
      state: 'ok',
      entities: [json.workflow],
    }))
  }
}

export default function* modules() {
  yield [
    takeLatest(A.WORKFLOW_CREATE, createWorkflow),
    takeLatest(A.WORKFLOW_SEARCH_MODULES, searchModules),
    takeLatest(A.WORKFLOWS_INIT, initWorkflows),
    takeLatest(A.WORKFLOW_INIT, initWorkflow),
    takeLatest(A.WORKFLOW_CREATE_TAG, createWorkflowTag),
    takeLatest(A.WORKFLOW_DELETE_TAG, deleteWorkflowTag),
    takeLatest(A.WORKFLOW_SUBMIT_FEEDBACK, submitWorkflowFeedback),
  ];
};
