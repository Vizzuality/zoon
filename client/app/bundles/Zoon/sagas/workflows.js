import { call, put, takeLatest, select } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import * as A from '../action_types';
import * as workflowActions from '../actions/workflows';
import * as moduleActions from '../actions/modules';
import * as workflowAPI from '../api/workflows';
import * as moduleAPI from '../api/modules';


function* createWorkflow(action) {
  const state = yield select();

  let json = yield workflowAPI.createWorkflow(
    action.workflow,
    state.auth.csrf,
  );

  if (json.errors) {
    //yield put(moduleActions.screenshotError(json.errors))
  } else {
    //yield put(push('/workflows'));
  }
}

function* searchModules(action) {
  const json = yield moduleAPI.searchModules(action.family, "", []);

  if (json.errors) {
  } else {
    yield put(moduleActions.finishModuleFetch(json))
  }
}

export default function* modules() {
  yield [
    takeLatest(A.WORKFLOW_CREATE, createWorkflow),
    takeLatest(A.WORKFLOW_SEARCH_MODULES, searchModules),
  ];
};
