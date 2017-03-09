import {objectFromPairs, filterAbsentValues, filterEmptyValues} from "../utils"

class GatedDispatcher {
  constructor (callable, fields) {
    this.callable = callable

    this.fields = {}
    Object.entries(fields).map(([k, v]) => {
      this.fields[k] = {
        relevantForData: true,
        decode: f => f,
        ...v,
      }
    })

    this.state = {}
    this.lastFiredState = {}
  }

  absorbValues (src) {
    this.state = {
      ...this.state,
      ...this.extractValues(src),
    }
  }

  overlayValues (src) {
    this.state = {
      ...this.state,
      ...filterAbsentValues(this.extractValues(src)),
    }
  }

  extractValues (src) {
    if (!src) { return {} }

    const result = {}
    const validFields = Object.keys(this.fields)

    for (var k in src) {
      if (validFields.indexOf(k) === -1) { continue }

      result[k] = this.fields[k].decode(src[k])
    }
    return result
  }

  projectFieldsRelevantForData (src) {
    return filterEmptyValues(objectFromPairs(
      Object.entries(this.fields)
        .map(([k, f]) => f.relevantForData ? [k, src[k]] : undefined)
        .filter(v => !!v)
    ))
  }

  wantsToFire () {
    const f = v => JSON.stringify(this.projectFieldsRelevantForData(v))
    return f(this.state) !== f(this.lastFiredState)
  }

  fire () {
    this.callable({...this.state})
    this.lastFiredState = this.state
  }

  maybeFire () {
    if (this.wantsToFire()) {
      this.fire()
    }
  }
}

export default GatedDispatcher
