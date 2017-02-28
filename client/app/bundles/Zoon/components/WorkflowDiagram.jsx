import React from "react"
import Reorder from "react-reorder"

const families = ["occurrence", "covariate", "process", "model", "output"]

const Switch = ({ id, checked, onChange }) => (
  <span className="switch tiny" style={{"margin": "0em 0.5em"}}>
    <input
      type="checkbox"
      className="switch-input"
      id={id}
      checked={checked}
      onChange={onChange}
    />
    <label className="switch-paddle" htmlFor={id} />
  </span>
)

const SelectedItem = ({ item, sharedProps }) => (
  <div style={{whiteSpace: "nowrap"}}>
    {item.title}
    <i
      className="fa fa-times-circle"
      style={{marginLeft: "0.25em"}}
      onClick={() => sharedProps.removeModule(item)}
    />
  </div>
)

export default ({
  expandedFamilies,
  compositionTypes,
  modules,
  editable = false,
  selectFamily,
  changeCompositionType,
  removeModule,
  reorderModules,
}) => (
  <ol style={{"display": "flex"}}>
    {families.map((family) => (
      <li key={family} className="module-card" style={{"width": "240px"}}>
        <div>
          {family}
          {
            !expandedFamilies[family] && editable &&
            <i
              onClick={() => selectFamily(family)}
              style={{marginLeft: "0.25em"}}
              className="fa fa-edit"
            />
          }
        </div>

        {
          expandedFamilies[family] &&
          <div>
            <div>
              List
              <Switch
                id={`switch-${family}`}
                checked={compositionTypes[family] === "chain"}
                onChange={(ev) => changeCompositionType(
                  family,
                  ev.target.checked ? "chain" : "list",
                )}
              />
              Chain
            </div>

            <Reorder
              lock="horizontal"
              itemKey="id"
              disableReorder={!editable}
              list={modules[family]}
              template={SelectedItem}
              callback={(a, b, c, d, list) => reorderModules(family, list)}
              sharedProps={{"removeModule": removeModule}}
            />

            Add a module
          </div> ||
          <div>
            {(modules[family] || []).length} modules selected
          </div>
        }
      </li>
    ))}
  </ol>
)
