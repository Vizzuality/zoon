import qs from "qs"
import {objectFromPairs} from "../utils"

export const encodeWorkflowQuerystring = (workflow) => {
  const {
    id,
    title,
    description,
    modules,
    update_path,
    compositionTypes,
  } = workflow

  return qs.stringify({
    id,
    title,
    description,
    modules: objectFromPairs(Object.entries(modules).map(
      ([f, ms]) => [
        f,
        ms.map(m => !m.visible && null || {
          id: m.id,
          name: m.name,
          title: m.title,
          family: m.family,
        }).filter(e => !!e),
      ],
    )),
    update_path,
    compositionTypes,
  })
}

export const usage = (workflow) => {
  return [].concat(
    ["workflow("],
    Object.entries(workflow.modules).map(([family, modules]) => {
      const composition = workflow.compositionTypes[family]
      let moduleList = modules.map((m) => m.name).join(", ")
      if (modules.length > 1) {
        moduleList = `${composition}(${moduleList})`
      }
      return `  ${family} = ${moduleList},`
    }),
    ["  forceReproducible = FALSE"],
    [")"],
  ).join("\n")
}

export const compositionTypes = ["list", "chain", "replicate"]
