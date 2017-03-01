import React from "react"
import { connect } from "react-redux"
import * as F from "react-foundation"
import qs from "qs"

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
  static propTypes = {
    workflow: React.PropTypes.shape({
      id: React.PropTypes.number,
      title: React.PropTypes.string.isRequired,
      description: React.PropTypes.string.isRequired,
      modules: React.PropTypes.objectOf(
        React.PropTypes.arrayOf(React.PropTypes.object)
      ).isRequired,
      composition_types: React.PropTypes.objectOf(
        React.PropTypes.oneOf(["list", "chain"]),
      ).isRequired,
    }),

    families: React.PropTypes.arrayOf(React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
    })).isRequired,
    entities: React.PropTypes.array.isRequired,
    workflowErrors: React.PropTypes.string,

    createWorkflow: React.PropTypes.func.isRequired,
    updateWorkflow: React.PropTypes.func.isRequired,
    searchModules: React.PropTypes.func.isRequired,
  }

  constructor (props) {
    super(props)

    this.state = {
      id: null,
      title: "",
      description: "",
      modules: {
        ...objectFromPairs(
          this.families().map((family) => [family, []])
        ),
      },
      compositionTypes: {
        ...objectFromPairs(
          this.families().map((family) => [family, "list"])
        ),
      },

      selectedFamily: this.families()[0],
    }

    const w = this.props.workflow || this.grabValuesFromLocationSearch()
    if (w) {
      this.state = {
        ...this.state,
        id: w.id || null,
        title: w.title,
        description: w.description,
        modules: {
          ...this.state.modules,
          ...w.modules,
        },
        compositionTypes: {
          ...this.state.composition_types,
          ...w.composition_types,
        },
      }
    }
  }

  grabValuesFromLocationSearch = () => {
    let s = this.props.location.search
    if (s[0] === "?") {
      s = s.slice(1)
    }
    return qs.parse(s)
  }

  saveWorkflow = (ev) => {
    ev.preventDefault()

    const {id, title, description, compositionTypes} = this.state
    const saver = this.state.id ? this.props.updateWorkflow : this.props.createWorkflow

    saver({
      id,
      title,
      description,
      compositionTypes,
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
          .state.modules[module.family]
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
            editable
            selectFamily={this.selectFamily}
            changeCompositionType={this.changeCompositionType}
            removeModule={this.removeModule}
            reorderModules={this.reorder}
          />
          {
            this.isComplete() &&
            <form onSubmit={this.saveWorkflow}>
              <Errors errors={this.props.workflowErrors} />
              <input
                type="text"
                placeholder="Title"
                value={this.state.title}
                onChange={(ev) => this.onFieldChange("title", ev)}
              />
              <textarea
                placeholder="Description"
                value={this.state.description}
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
    entities: state.modules.entities,
  }),
  {
    ...workflowsActions,
  }
)(WorkflowCreator)
