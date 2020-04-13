const jsToJsxByReact  = require("../react").default;


test("react component jsx",()=>{
  expect(jsToJsxByReact(`t.default = function () {
    const e = o.a.createElement("h1", null, "Hello, ", "Josh Perez");
    return o.a.createElement("div", null, o.a.createElement("button", {
      onClick: this.handleClick.bind(this),
      disabled: this.state.disabled
    }, "Add Item"), this.state.if ? o.a.createElement("div", null, "123456") : null, o.a.createElement("ul", null, this.state.items.map((function (e, t) {
      return o.a.createElement("li", {
        key: t
      }, e)
    }))), e)
  }`)).toMatchSnapshot()
})


