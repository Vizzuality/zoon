import { jsonFetch } from "./helpers"
import buildUrl from "build-url"

export const searchModules = function (searchFamily, searchQuery, selectedGeos) {
  return jsonFetch(
    buildUrl(
      "/api/modules",
      {queryParams: { searchFamily, searchQuery, selectedGeos }},
    ),
    {
      credentials: "same-origin",
    },
  )
}
