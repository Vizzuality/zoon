const rdMacro = (name) => new RegExp(
  `\\\\${name}(?:\\[[^\\]]*\\])?{([^}]+)}`,
  "g",
)

export const rd2html = (rd) => {
  return [
    [rdMacro("link"), "$1"],
    [rdMacro("code"), "<code>$1</code>"],
    [rdMacro("strong"), "<strong>$1</strong>"],
    [rdMacro("emph"), "<em>$1</em>"],
    [rdMacro("url"), '<a href="$1">$1</a>'],
    [/\n/g, "<br>"],
  ].reduce(
    (s, [re, subst]) => s.replace(re, subst),
    rd,
  )
}
