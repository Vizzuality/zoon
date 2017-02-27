import * as A from "../action_types"

export const formChange = (name) => ({
  type: A.TAG_FORM_CHANGE,
  name,
})

export const autoComplete = (name, names) => ({
  type: A.TAG_AUTOCOMPLETE,
  name,
  names,
})

export const autoCompleteSelect = (name) => ({
  type: A.TAG_AUTOCOMPLETE_SELECT,
  name,
})
