import { jsonFetch } from "./helpers"

export const createWorkflow = function (workflow, csrf) {
  return jsonFetch("/api/workflows", {
    method: "POST",
    credentials: "same-origin",
    body: JSON.stringify({ workflow }),
    headers: new Headers({
      "X-CSRF-TOKEN": csrf,
      "Content-Type": "application/json",
      "Accept": "application/json",
    }),
  })
}

export const updateWorkflow = function (workflow, csrf) {
  return jsonFetch(workflow.update_path, {
    method: "PUT",
    credentials: "same-origin",
    body: JSON.stringify({ workflow }),
    headers: new Headers({
      "X-CSRF-TOKEN": csrf,
      "Content-Type": "application/json",
      "Accept": "application/json",
    }),
  })
}

export const listWorkflows = function (csrf) {
  return jsonFetch("/api/workflows", {
    credentials: "same-origin",
    headers: new Headers({
      "X-CSRF-TOKEN": csrf,
      "Content-Type": "application/json",
      "Accept": "application/json",
    }),
  })
}

export const getWorkflow = function (id, csrf) {
  return jsonFetch(`/api/workflows/${id}`, {
    credentials: "same-origin",
    headers: new Headers({
      "X-CSRF-TOKEN": csrf,
      "Content-Type": "application/json",
      "Accept": "application/json",
    }),
  })
}

export const submitWorkflowFeedback = function (workflow, feedback, csrf) {
  return jsonFetch(workflow.feedback_path, {
    method: "POST",
    credentials: "same-origin",
    body: JSON.stringify({ feedback }),
    headers: new Headers({
      "X-CSRF-TOKEN": csrf,
      "Content-Type": "application/json",
      "Accept": "application/json",
    }),
  })
}
