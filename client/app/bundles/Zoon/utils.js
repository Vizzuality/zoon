export function objectFromPairs (pairs) {
  let obj = {}

  pairs.forEach((pair) => {
    obj[pair[0]] = pair[1]
  })

  return obj
}
