import * as A from '../action_types';


export const createWorkflow = (workflow) => ({
  type: A.WORKFLOW_CREATE,
  workflow,
});

export const searchModules = (family) => ({
  type: A.WORKFLOW_SEARCH_MODULES,
  family,
});
