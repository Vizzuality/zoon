import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router"
import WorkflowDiagram from "./WorkflowDiagram"

import * as workflowsActions from "../actions/workflows"

const WorkflowCard = ({ w, deleteWorkflow }) => {
  return (
    <div className="workflow-card-wrapper" key={w.id}>
      <div className="workflow-card">
        <div className="meta">
          <p className="meta__title"><Link to={`/workflows/${w.id}`}>{w.title}</Link></p>
          <p className="meta__description">{w.description}</p>
        </div>
        <div className="actions">
          { w.update_path &&
            <Link to={`/workflows/${w.id}/edit`} className="button hollow" >
              Edit
            </Link>
          }
          { w.delete_path &&
            <a href={w.delete_path} onClick={(e) => { e.preventDefault(); deleteWorkflow(w) }}>
              <i className="fa fa-trash" />
            </a>
          }
        </div>
      </div>

      <WorkflowDiagram
        compositionTypes={w.compositionTypes || {}}
        modules={w.modules || {}}
      />
    </div>
  )
}

WorkflowCard.propTypes = {
  w: React.PropTypes.object,
  deleteWorkflow: React.PropTypes.func.isRequired,
}

export default connect(
  (state) => ({
  }),
  {
    deleteWorkflow: workflowsActions.deleteWorkflow,
  })(WorkflowCard)
