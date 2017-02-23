import * as A from '../action_types';


export const createWorkflow = (workflow) => ({
  type: A.WORKFLOW_CREATE,
  workflow,
});

export const searchModules = (family) => ({
  type: A.WORKFLOW_SEARCH_MODULES,
  family,
});

export const initWorkflows = () => ({
  type: A.WORKFLOWS_INIT,
});

export const finishWorkflowFetch = (result) => ({
  type: A.WORKFLOWS_FETCH_FINISHED,
  result,
});
