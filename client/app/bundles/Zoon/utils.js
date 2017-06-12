export function objectFromPairs (pairs) {
  let obj = {}

  pairs.forEach((pair) => {
    obj[pair[0]] = pair[1]
  })

  return obj
}

export function filterAbsentValues (obj) {
  let result = {}
  for (var k in obj) {
    const v = obj[k]
    if (v === null || v === undefined) {
      continue
    }

    result[k] = v
  }
  return result
}

export function filterEmptyValues (obj) {
  let result = {}
  for (var k in obj) {
    const v = obj[k]
    if (
      v === null ||
      v === undefined ||
      v === "" ||
      (Array.isArray(v) && v.length === 0)
    ) {
      continue
    }

    result[k] = v
  }
  return result
}

export function zip (...arrays) {
  const length = Math.min(...arrays.map(a => a.length))
  return Array.from({ length }, (_, i) => arrays.map(a => a[i]))
}

export const upFirstLetter = (s) => s.charAt(0).toUpperCase() + s.substr(1).toLowerCase()
