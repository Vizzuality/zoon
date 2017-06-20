import * as F from "react-foundation"
import { connect } from "react-redux"
import { goBack } from "react-router-redux"
import { Link } from "react-router"
import React from "react"

import * as workflowsActions from "../actions/workflows"
import Code from "./Code"
import {encodeWorkflowQuerystring, usage, compositionTypes} from "../lib/workflow"
import ModuleCard from "./ModuleCard"
import {objectFromPairs, parseLocationSearch} from "../utils"
import WorkflowDiagram from "./WorkflowDiagram"
import {families} from "../lib/module"

function onlyUnique (value, index, self) {
  return self.indexOf(self.find(e => e.id === value.id)) === index
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
      compositionTypes: React.PropTypes.objectOf(
        React.PropTypes.oneOf(compositionTypes),
      ).isRequired,
    }),

    user: React.PropTypes.object.isRequired,
    entities: React.PropTypes.array.isRequired,

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
          families.map((family) => [family, []])
        ),
      },
      compositionTypes: {
        ...objectFromPairs(
          families.map((family) => [family, "list"])
        ),
      },
      update_path: null,

      selectedFamily: families[0],
      showingModule: null,
    }

    const w = this.props.workflow || parseLocationSearch(this.props.location.search)
    if (w) {
      this.state = {
        ...this.state,
        id: w.id || null,
        title: w.title || "",
        description: w.description || "",
        modules: {
          ...this.state.modules,
          ...w.modules,
        },
        compositionTypes: {
          ...this.state.compositionTypes,
          ...w.compositionTypes,
        },
        update_path: w.update_path,
      }
    }
  }

  componentDidMount () {
    this.props.searchModules(this.state.selectedFamily)
  }

  isComplete () {
    return Object
      .values(this.state.modules)
      .every((modules) => (modules.length > 0))
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
      showingModule: null,
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
    return families.indexOf(this.state.selectedFamily) + 1
  }

  totalSteps () {
    return families.length
  }

  showModuleLightbox = (moduleId) => {
    if (!moduleId) {
      this.setState({showingModule: null})
      return
    }

    const showingModule = this.props.entities.find((m) => m.id === moduleId)
    if (showingModule === undefined) {
      console.error(`Trying to show unexisting module with id ${moduleId}`)
      this.setState({showingModule: null})
      return
    }

    this.setState({showingModule})
  }

  render () {
    return (
      <span className="workflow-creator theatre">
        { !this.props.user.id && <F.Row>
          <F.Column small={12}>
            You need to be logged in to save workflows. Want
            to <Link to="/users/sign_in">Sign In</Link> {" "}
            or <Link to="/users/sign_up">Sign Up</Link>?
          </F.Column>
        </F.Row> }

        <F.Row className="stage">
          <F.Column small={12}>
            <div className="mosaic">
              {this.props.entities.map(m => <ModuleCard
                key={m.id}
                m={m}
                onClick={() => this.addModule(m)}
              />)}
            </div>
          </F.Column>
          {this.state.showingModule && (
            <div className="lightbox">
              <ModuleCard m={this.state.showingModule} link={false} />
            </div>
          )}
        </F.Row>

        <F.Row className="pit">
          <F.Column small={12}>
            <div className="status">
              {this.currentStep()}/{this.totalSteps()} {
              } Select a {this.state.selectedFamily} module
            </div>

            <WorkflowDiagram
              expandedFamily={this.state.selectedFamily}
              compositionTypes={this.state.compositionTypes}
              modules={this.state.modules}
              editable
              selectFamily={this.selectFamily}
              changeCompositionType={this.changeCompositionType}
              removeModule={this.removeModule}
              reorderModules={this.reorder}
              onModuleHover={this.showModuleLightbox}
            />
            {
              this.isComplete() && (
                <F.Row>
                  <F.Column offsetOnSmall={3} small={6}>
                    <h5>Usage</h5>
                    <p className="faded">
                      Copy these lines into your R console
                    </p>
                    <Code> {usage(this.state)}</Code>
                  </F.Column>
                </F.Row>
              )
            }
            {
              this.props.user.id && this.isComplete() && (
                <span className="buttons">
                  <F.Button className="hollow back" onClick={this.props.goBack}>
                    Cancel
                  </F.Button>
                  <Link className="button continue"
                    to={`/workflows/save?${encodeWorkflowQuerystring(this.state)}`}
                  >
                    Continue
                  </Link>
                </span>
              )
            }
          </F.Column>
        </F.Row>
      </span>
    )
  };
}

export default connect(
  (state) => ({
    user: state.auth,
    entities: state.modules.entities,
  }),
  {
    ...workflowsActions,
    goBack,
  }
)(WorkflowCreator)
