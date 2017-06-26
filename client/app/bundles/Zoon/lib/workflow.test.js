import {usage} from "./workflow"

describe("usage", () => {
  test("full", () => {
    expect(usage({
      compositionTypes: {
        occurrence: "replicate",
        covariate: "chain",
        process: "list",
        model: "chain",
        output: "chain",
      },
      modules: {
        occurrence: [{name: "AnophelesPlumbeus"}, {name: "SpOcc"}],
        covariate: [{name: "Bioclim"}, {name: "NCEP"}],
        process: [{name: "Clean"}, {name: "Dirty"}],
        model: [{name: "MaxEnt"}],
        output: [{name: "Appify"}],
      },
    })).toEqual(
      [
        "workflow(",
        "  occurrence = replicate(AnophelesPlumbeus, SpOcc),",
        "  covariate = chain(Bioclim, NCEP),",
        "  process = list(Clean, Dirty),",
        "  model = MaxEnt,",
        "  output = Appify,",
        "  forceReproducible = FALSE",
        ")",
      ].join("\n"),
    )
  })

  test("partial", () => {
    expect(usage({
      compositionTypes: {
        occurrence: "replicate",
        covariate: "chain",
        process: "chain",
        model: "chain",
        output: "chain",
      },
      modules: {
        occurrence: [{name: "AnophelesPlumbeus"}, {name: "SpOcc"}],
      },
    })).toEqual(
      [
        "workflow(",
        "  occurrence = replicate(AnophelesPlumbeus, SpOcc),",
        "  forceReproducible = FALSE",
        ")",
      ].join("\n"),
    )
  })
})

