import React from "react"
import { Link } from "react-router"
import WorkflowDiagram from "./WorkflowDiagram"

export default ({ w }) => {
  return (
    <div className="workflow-card-wrapper" key={w.id}>
      <div className="workflow-card">
        <div className="meta">
          <p className="meta__title"><Link to={`/workflows/${w.id}`}>{w.title}</Link></p>
          <p className="meta__description">{w.description}</p>
        </div>
        <div className="actions">
          <Link to={`/workflows/${w.id}/edit`} className="button hollow">Edit</Link>
          <a href="javascript:void(0)"><i className="fa fa-trash" /></a>
        </div>
      </div>

      <WorkflowDiagram
        expandedFamilies={{}}
        compositionTypes={w.compositionTypes || {}}
        modules={w.modules || {}}
      />
    </div>
  )
}
