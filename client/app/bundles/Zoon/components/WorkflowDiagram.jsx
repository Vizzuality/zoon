import React from "react"
import Reorder from "react-reorder"

const families = ["occurrence", "covariate", "process", "model", "output"]

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
)

const SelectedItem = ({ item, sharedProps }) => (
  <div style={{"height": "100px"}}>
    {item.title}
    <i
      className="fa fa-times-circle"
      onClick={() => sharedProps.removeModule(item)}
    />
  </div>
)

export default ({
  expandedFamilies,
  compositionTypes,
  modules,
  editable,
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
            !expandedFamilies[family] &&
            <i onClick={() => selectFamily(family)} className="fa fa-edit" />
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
