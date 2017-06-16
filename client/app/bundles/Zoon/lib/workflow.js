import qs from "qs"
import {objectFromPairs} from "../utils"

export const encodeWorkflowQuerystring = (workflow) => {
  const {
    id,
    title,
    description,
    modules,
    update_path,
    composition_types,
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
    composition_types,
    compositionTypes,
  })
}

