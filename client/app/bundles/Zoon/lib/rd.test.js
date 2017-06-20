import {rd2html} from "./rd"

describe("rd2html", () => {
  test("code", () => {
    expect(rd2html("\\code{hello}")).toBe("<code>hello</code>")
  })
  test("strong", () => {
    expect(rd2html("\\strong{hello}")).toBe("<strong>hello</strong>")
  })
  test("emph", () => {
    expect(rd2html("\\emph{hello}")).toBe("<em>hello</em>")
  })
  test("link", () => {
    expect(rd2html("\\link{hello}")).toBe("hello")
  })
  test("link with attributes", () => {
    expect(rd2html("\\link[base]{hello}")).toBe("hello")
  })
  test("link in code", () => {
    expect(rd2html("\\code{\\link{hello}}")).toBe("<code>hello</code>")
  })
  test("url", () => {
    expect(rd2html("\\url{http://example.com}")).toBe('<a href="http://example.com">http://example.com</a>')
  })
  test("new line", () => {
    expect(rd2html("a\nb\n\nc")).toBe("a<br>b<br><br>c")
  })
})
