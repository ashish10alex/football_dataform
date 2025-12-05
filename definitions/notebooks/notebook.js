notebook({
    filename: "test.ipynb",
    dependencyTargets: [{
        name: "0100_NESTED_DATA",
      }],
    tags: ["new_tag"]
})


notebook({
    filename: "new.ipynb",
    dependencyTargets: [{
        name: "0200_NESTED_SELECT",
      }],
    tags: ["dpr"]
})