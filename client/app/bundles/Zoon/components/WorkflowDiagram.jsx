import React from "react"
import Reorder from "react-reorder"
import classnames from "classnames"

import {upFirstLetter} from "../utils"
import {families} from "../lib/module"
import {compositionTypes as allCompositionTypes} from "../lib/workflow"


const Switch = ({ value, onChange }) => (
  <div className="module-list__switch">
    {allCompositionTypes.map((compType) => {
      const isSelected = value === compType
      return <span key={compType} onClick={() => onChange(compType)}>
        <i
          className={classnames(
            "fa",
            isSelected ? "fa-dot-circle-o" : "fa-circle-o",
          )}
        />
        <span className={classnames("name", {selected: isSelected})}>
          {upFirstLetter(compType)}
        </span>
      </span>
    })}
  </div>
)

const SelectedItem = ({ item, sharedProps }) => (
  <div
    className="module-list__list__item"
    onMouseEnter={() => sharedProps.onModuleHover(item.id)}
    onMouseLeave={() => sharedProps.onModuleHover(null)}
  >
    {item.name}
    <i
      className="fa fa-times-circle"
      onMouseDown={(ev) => ev.stopPropagation()}
      onClick={() => sharedProps.removeModule(item)}
    />
  </div>
)

const WorkflowDiagram = ({
  expandedFamily,
  compositionTypes,
  modules,
  editable = false,
  selectFamily,
  changeCompositionType,
  removeModule,
  reorderModules,
  onModuleHover,
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
                expandedFamily !== family && editable &&
                <i
                  onClick={() => selectFamily(family)}
                  className="fa fa-pencil"
                />
              }
            </div>

            {
              expandedFamily === family &&
              <div>
                <span className={`module-family-${family} module-family-background-color`} />
                <Switch
                  value={compositionTypes[family]}
                  onChange={(v) => changeCompositionType(family, v)}
                />

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
                    sharedProps={{removeModule, onModuleHover}}
                  />
                }

              </div>
            }
          </div>
          {
            expandedFamily === family &&
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
