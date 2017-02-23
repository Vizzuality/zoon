import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import * as F from 'react-foundation';

import * as workflowsActions from '../actions/workflows'


function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function objectFromPairs(pairs) {
  let obj = {};

  pairs.forEach((pair) => {
    obj[pair[0]] = pair[1];
  });

  return obj;
}

const Switch = ({ id, checked, onChange }) => (
  <div className="switch tiny">
    <input
      type="checkbox"
      className="switch-input"
      id={id}
      checked={checked}
      onChange={onChange}
    />
    <label className="switch-paddle" htmlFor={id} />
  </div>
);


class WorkflowCreator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedFamily: this.families()[0],
      modules: objectFromPairs(
        this.families().map((family) => [family, []])
      ),
      compositionTypes: objectFromPairs(
        this.families().map((family) => [family, 'list'])
      ),
    }
  }

  componentDidMount() {
    this.props.searchModules(this.state.selectedFamily);
  }

  families() {
    return this.props.families.map((family) => family.name);
  }

  isComplete() {
    return Object.
      values(this.state.modules).
      every((modules) => (modules.length > 0));
  }

  onFieldChange(key, ev) {
    this.setState({
      [key]: ev.target.value,
    })
  }

  addModule(module) {
    this.setState({
      modules: {
        ...this.state.modules,
        [module.family]: this.
          state.
          modules[module.family].
          concat([module]).
          filter(onlyUnique),
      },
    });
  }

  removeModule(module) {
    this.setState({
      modules: {
        ...this.state.modules,
        [module.family]: this.
          state.modules[module.family].
          filter((m) => m.id != module.id),
      },
    });
  }

  changeCompositionType(family, type) {
    this.setState({
      compositionTypes: {
        ...this.state.compositionTypes,
        [family]: type,
      }
    });
  }

  selectFamily(family) {
    this.setState({ selectedFamily: family });
    this.props.searchModules(family);
  }

  isFamilySelected(family) {
    return this.state.selectedFamily == family;
  }

  createWorkflow(ev) {
    ev.preventDefault();

    this.props.createWorkflow({
      title: this.state.title,
      description: this.state.description,
      compositionTypes: this.state.compositionTypes,
      modules: Object.
        values(this.state.modules).
        reduce((acc, v) => acc.concat(v)).
        map((module) => module.id),
    });
  }

  currentStep() {
    return this.families().indexOf(this.state.selectedFamily) + 1;
  }

  totalSteps() {
    return this.families().length;
  }

  render() {
    return (
      <span>
        <F.Row>
          <ul>
            {this.props.entities.map((module)=>(
              <p onClick={()=>this.addModule(module)} key={module.id}>
                {module.title}
              </p>
            ))}
          </ul>
        </F.Row>
        <F.Row>
          <h3>
            {this.currentStep()}/{this.totalSteps()} {
            } Select a {this.state.selectedFamily} module
          </h3>

          <ol style={{"display": "flex"}}>
            {this.families().map((family) => (
              <li
                key={family}
                className="module-card"
                style={{"width": "240px"}}
              >
                <div>
                  {family}
                  {
                    !this.isFamilySelected(family) &&
                    <i
                      onClick={()=>this.selectFamily(family)}
                      className="fa fa-edit"
                    />
                  }
                </div>

                {
                  this.isFamilySelected(family) &&
                  <div>
                    <div>
                      List
                      <Switch
                        id={`switch-${family}`}
                        checked={this.state.compositionTypes[family] == 'chain'}
                        onChange={(ev) => this.changeCompositionType(
                          family,
                          ev.target.checked?'chain':'list',
                        )}
                      />
                      Chain
                    </div>

                    {(this.state.modules[family] || []).map((module) => (
                      <div key={module.id}>
                        {module.title}
                        <i
                          className="fa fa-times-circle"
                          onClick={()=>this.removeModule(module)}
                        />
                      </div>
                    ))}

                    Add a module
                  </div> ||
                  <div>
                    {this.state.modules[family].length} modules selected
                  </div>
                }
              </li>
            ))}
          </ol>

          {
            this.isComplete() &&
            <form onSubmit={this.createWorkflow.bind(this)}>
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
    );
  };
}

export default connect(
  (state) => ({
    families: state.families.entities,
    ...state.modules,
  }),
  {
    ...workflowsActions,
  }
)(WorkflowCreator);