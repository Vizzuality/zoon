import * as A from "../action_types"

export const createWorkflow = (workflow) => ({
  type: A.WORKFLOW_CREATE,
  workflow,
})

export const searchModules = (family) => ({
  type: A.WORKFLOW_SEARCH_MODULES,
  family,
})

export const initWorkflows = () => ({
  type: A.WORKFLOWS_INIT,
})

export const initWorkflow = (id) => ({
  type: A.WORKFLOW_INIT,
  id,
})

export const finishWorkflowFetch = (result) => ({
  type: A.WORKFLOWS_FETCH_FINISHED,
  result,
})

export const createTag = (tagCreatePath, tag) => ({
  type: A.WORKFLOW_CREATE_TAG,
  tagCreatePath,
  tag,
})

export const deleteTag = (tagDeletePath) => ({
  type: A.WORKFLOW_DELETE_TAG,
  tagDeletePath,
})

export const submitFeedback = (workflow, rating, comment) => ({
  type: A.WORKFLOW_SUBMIT_FEEDBACK,
  workflow,
  rating,
  comment,
})

export const submitFeedbackFinished = (result) => ({
  type: A.WORKFLOW_SUBMIT_FEEDBACK_FINISHED,
  result,
})
