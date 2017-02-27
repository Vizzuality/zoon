import React from "react"
import { connect } from "react-redux"
import * as F from "react-foundation"

import * as workflowsActions from "../actions/workflows"
import ModuleCard from "./ModuleCard"
import WorkflowDiagram from "./WorkflowDiagram"
import Errors from "./Errors"

function onlyUnique (value, index, self) {
  return self.indexOf(value) === index
}

function objectFromPairs (pairs) {
  let obj = {}

  pairs.forEach((pair) => {
    obj[pair[0]] = pair[1]
  })

  return obj
}

class WorkflowCreator extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedFamily: this.families()[0],
      modules: objectFromPairs(
        this.families().map((family) => [family, []])
      ),
      compositionTypes: objectFromPairs(
        this.families().map((family) => [family, "list"])
      ),
    }
  }

  createWorkflow = (ev) => {
    ev.preventDefault()

    this.props.createWorkflow({
      title: this.state.title,
      description: this.state.description,
      compositionTypes: this.state.compositionTypes,
      modules: Object
        .values(this.state.modules)
        .reduce((acc, v) => acc.concat(v))
        .map((module) => module.id),
    })
  }

  componentDidMount () {
    this.props.searchModules(this.state.selectedFamily)
  }

  families () {
    return this.props.families.map((family) => family.name)
  }

  isComplete () {
    return Object
      .values(this.state.modules)
      .every((modules) => (modules.length > 0))
  }

  onFieldChange (key, ev) {
    this.setState({
      [key]: ev.target.value,
    })
  }

  addModule (module) {
    this.setState({
      modules: {
        ...this.state.modules,
        [module.family]: this
          .state
          .modules[module.family]
          .concat([module])
          .filter(onlyUnique),
      },
    })
  }

  removeModule = (module) => {
    this.setState({
      modules: {
        ...this.state.modules,
        [module.family]: this
          .state.modules[module.family]
          .filter((m) => m.id !== module.id),
      },
    })
  }

  changeCompositionType = (family, type) => {
    this.setState({
      compositionTypes: {
        ...this.state.compositionTypes,
        [family]: type,
      },
    })
  }

  selectFamily = (family) => {
    this.setState({ selectedFamily: family })
    this.props.searchModules(family)
  }

  isFamilySelected (family) {
    return this.state.selectedFamily === family
  }

  reorder = (family, list) => {
    this.setState({
      modules: {
        ...this.state.modules,
        [family]: list,
      },
    })
  }

  currentStep () {
    return this.families().indexOf(this.state.selectedFamily) + 1
  }

  totalSteps () {
    return this.families().length
  }

  render () {
    return (
      <span>
        <F.Row>
          <div className="mosaic">
            {this.props.entities.map(m => <ModuleCard
              key={m.id}
              m={m}
              onClick={() => this.addModule(m)}
            />)}
          </div>
        </F.Row>
        <F.Row>
          <h3>
            {this.currentStep()}/{this.totalSteps()} {
            } Select a {this.state.selectedFamily} module
          </h3>

          <WorkflowDiagram
            expandedFamilies={{[this.state.selectedFamily]: true}}
            compositionTypes={this.state.compositionTypes}
            modules={this.state.modules}
            editable="true"
            selectFamily={this.selectFamily}
            changeCompositionType={this.changeCompositionType}
            removeModule={this.removeModule}
            reorderModules={this.reorder}
          />
          {
            this.isComplete() &&
            <form onSubmit={this.createWorkflow}>
              <Errors errors={this.props.workflowErrors} />
              <input
                type="text"
                placeholder="Title"
                onChange={(ev) => this.onFieldChange("title", ev)}
              />
              <textarea
                placeholder="Description"
                onChange={(ev) => this.onFieldChange("description", ev)}
              />
              <input type="submit" placeholder="Save" />
            </form>
          }
        </F.Row>
      </span>
    )
  };
}

export default connect(
  (state) => ({
    families: state.families.entities,
    workflowErrors: state.workflows.errors,
    ...state.modules,
  }),
  {
    ...workflowsActions,
  }
)(WorkflowCreator)
