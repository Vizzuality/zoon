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
  <div className="module-list__list__item">
    {item.title}
    <i
      className="fa fa-times-circle"
      onMouseDown={(ev) => ev.stopPropagation()}
      onClick={() => sharedProps.removeModule(item)}
    />
  </div>
)

const WorkflowDiagram = ({
  expandedFamilies,
  compositionTypes,
  modules,
  editable = false,
  selectFamily,
  changeCompositionType,
  removeModule,
  reorderModules,
}) => (
  <ol className="workflow-diagram">
    {families.map((family) => (
      <li key={family}>
        <div>
          <div className="module-list">
            <div className="module-list__header">
              <span className={`module-family-${family} module-family-background`}>
                {family}
              </span>
              {
                !expandedFamilies[family] && editable &&
                <i
                  onClick={() => selectFamily(family)}
                  className="fa fa-pencil"
                />
              }
            </div>

            {
              expandedFamilies[family] &&
              <div>
                <span className={`module-family-${family} module-family-background-color`} />
                <div className="module-list__chaining">
                  <span className={compositionTypes[family] !== "chain" ? "selected" : ""}>List</span>
                  <Switch
                    id={`switch-${family}`}
                    checked={compositionTypes[family] === "chain"}
                    onChange={(ev) => changeCompositionType(
                      family,
                      ev.target.checked ? "chain" : "list",
                    )}
                  />
                  <span className={compositionTypes[family] === "chain" ? "selected" : ""}>Chain</span>
                </div>

                {
                  modules[family].length > 0 &&
                  <Reorder
                    lock="horizontal"
                    itemKey="id"
                    disableReorder={!editable}
                    listClass="module-list__list"
                    list={modules[family]}
                    template={SelectedItem}
                    callback={(a, b, c, d, list) => reorderModules(family, list)}
                    sharedProps={{removeModule}}
                  />
                }

              </div>
            }
          </div>
          {
            expandedFamilies[family] &&
            <p className="add-module-cta">Add a module</p> ||
            <p className="n-modules-selected">
              {(modules[family] || []).length} modules selected
            </p>
          }
        </div>
      </li>
    ))}
  </ol>
)
export default WorkflowDiagram
