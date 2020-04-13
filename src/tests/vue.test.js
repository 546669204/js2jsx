const jsToJsxByVue  = require("../vue").default;

test("vue component static",()=>{
    expect(jsToJsxByVue(`o=function(){var e=this.$createElement;return(this._self._c||e)("div",{attrs:{id:"id123",attr:"attr"}},[this._v("静态组件渲染")])};`)).toMatchSnapshot()
})


test("vue component syntax",()=>{
  expect(jsToJsxByVue(`var s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("span",[t._v("Message: "+t._s(t.msg))]),t._v(" "),t._v(" "),n("span",{domProps:{innerHTML:t._s(t.rawHtml)}}),t._v(" "),n("div",{attrs:{id:t.dynamicId}}),t._v(" "),n("button",{attrs:{disabled:t.isButtonDisabled}},[t._v("Button")]),t._v(" "),n("div",{attrs:{id:"list-"+t.id}}),t._v("n  "+t._s(t.message.split("").reverse().join(""))+"n")])};`)).toMatchSnapshot()
})





test("vue component v-model",()=>{
  expect(jsToJsxByVue(`var o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("input",{directives:[{name:"model",rawName:"v-model",value:e.c,expression:"c"}],domProps:{value:e.c},on:{input:function(t){t.target.composing||(e.c=t.target.value)}}})])};`)).toMatchSnapshot()
})




test("vue component v-if",()=>{
  expect(jsToJsxByVue('var o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.a?n("div",[e._v("n  123123n  "),e.c?n("span",[e._v("dsaqwe")]):e._e(),e._v(" "),n("div",[e.b?n("video",{attrs:{src:""}}):e._e()])]):e._e()};')).toMatchSnapshot()
})




test("vue component dynamic-components",()=>{
  expect(jsToJsxByVue('var o=function(){var t=this.$createElement,e=this._self._c||t;return e("div",[e("keep-alive",[e(this.currentTabComponent,{tag:"component"})],1),this._v(" "),e(this.currentTabComponent,{tag:"component"})],1)};')).toMatchSnapshot()
})




test("vue component v-show",()=>{
  expect(jsToJsxByVue('var o=function(){var e=this.$createElement;return(this._self._c||e)("h1",{directives:[{name:"show",rawName:"v-show",value:this.ok,expression:"ok"}]},[this._v("Hello!")])};')).toMatchSnapshot()
})




test("vue component slot",()=>{
  expect(jsToJsxByVue('var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("my-functional-component",{scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(t.user.firstName)+" "),t.user?n("div"):e._e()]}},{key:"foo",fn:function(){return[e._v("first")]},proxy:!0},{key:e.dynamicSlotName,fn:function(){return[e._v("...")]},proxy:!0},{key:"header",fn:function(){return[n("h1",[e._v("header1-h1")]),e._v(" "),n("h2",[e._v("header1-h2")])]},proxy:!0},{key:"header2",fn:function(){return[e._v("header2")]},proxy:!0}],null,!0)},[e._t("default",[e._v("备用内容")]),e._v(" "),e._t("footer",null,{user:e.user}),e._v(" "),n("h1",{attrs:{slot:"header"},slot:"header"},[e._v("旧插槽")]),e._v(" "),e._v(" "),e._v(" "),n("div",{staticClass:"demo-alert-box"},[n("strong",[e._v("Error!")]),e._v(" "),e._t("default")],2),e._v(" "),e._v(" "),n("p",[e._v("second")]),e._v(" "),e._v(" "),n("current-user",{scopedSlots:e._u([{key:"ccc",fn:function(t){var n=t.user.d,r=t.user,o=t.name;return[e._v(e._s(r.firstName+o+n))]}}])}),e._v(" "),n("current-user",{scopedSlots:e._u([{key:"default",fn:function(t){var n=t.user;return void 0===n&&(n={firstName:"Guest"}),[e._v(e._s(n.firstName))]}}])})],2)};')).toMatchSnapshot()
})





test("vue component custom-directive",()=>{
  expect(jsToJsxByVue(`var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("div",{directives:[{name:"demo",rawName:"v-demo:foo.a.b",value:e.message,expression:"message",arg:"foo",modifiers:{a:!0,b:!0}}],attrs:{id:"hook-arguments-example"}}),e._v(" "),n("input",{directives:[{name:"focus",rawName:"v-focus"}]}),e._v(" "),n("div",{attrs:{id:"baseexample"}},[n("p",[e._v("Scroll down the page")]),e._v(" "),n("p",{directives:[{name:"pin",rawName:"v-pin",value:200,expression:"200"}]},[e._v("Stick me 200px from the top of the page")])]),e._v(" "),n("div",{attrs:{id:"dynamicexample"}},[n("h3",[e._v("Scroll down inside this section ↓")]),e._v(" "),n("p",{directives:[{name:"pin",rawName:"v-pin:[direction]",value:200,expression:"200",arg:e.direction}]},[e._v("I am pinned onto the page at 200px to the left.")])]),e._v(" "),n("div",{directives:[{name:"demo",rawName:"v-demo",value:{color:"white",text:"hello!"},expression:"{ color: 'white', text: 'hello!' }"}]})])};`)).toMatchSnapshot()
})



test("vue component event",()=>{
  expect(jsToJsxByVue(`var o=function(){var n=this,e=n.$createElement,t=n._self._c||e;return t("div",{attrs:{id:"example-1"}},[t("button",{on:{click:function(e){n.counter+=1}}},[n._v("Add 1")]),n._v(" "),t("p",[n._v("The button above has been clicked "+n._s(n.counter)+" times.")]),n._v(" "),t("button",{on:{click:n.greet}},[n._v("Greet")]),n._v(" "),t("button",{on:{click:function(e){return n.say("hi")}}},[n._v("Say hi")]),n._v(" "),t("a",{on:{click:function(e){return e.stopPropagation(),n.doThis(e)}}}),n._v(" "),t("form",{on:{submit:function(e){return e.preventDefault(),n.onSubmit(e)}}}),n._v(" "),t("a",{on:{click:function(e){return e.stopPropagation(),e.preventDefault(),n.doThat(e)}}}),n._v(" "),t("form",{on:{submit:function(n){n.preventDefault()}}}),n._v(" "),t("div",{on:{"!click":function(e){return n.doThis(e)}}},[n._v("...")]),n._v(" "),t("div",{on:{click:function(e){return e.target!==e.currentTarget?null:n.doThat(e)}}},[n._v("...")]),n._v(" "),t("a",{on:{"~click":function(e){return n.doThis(e)}}}),n._v(" "),t("div",{on:{"&scroll":function(e){return n.onScroll(e)}}},[n._v("...")]),n._v(" "),t("input",{on:{keyup:function(e){return!e.type.indexOf("key")&&n._k(e.keyCode,"enter",13,e.key,"Enter")?null:n.submit(e)}}}),n._v(" "),t("input",{on:{keyup:function(e){if(!e.type.indexOf("key")&&n._k(e.keyCode,"page-down",void 0,e.key,void 0))return null;n.a?n.onPageDown:n.onPageDown2}}}),n._v(" "),t("input",{on:{keyup:function(e){return e.type.indexOf("key")||13===e.keyCode?n.submit(e):null}}}),n._v(" "),t("input",{on:{keyup:function(e){return!e.type.indexOf("key")&&13!==e.keyCode&&n._k(e.keyCode,"delete",[8,46],e.key,["Backspace","Delete","Del"])?null:e.shiftKey?n.submit(e):null}}}),n._v(" "),t("input",{on:{keyup:function(e){return!e.type.indexOf("key")&&13!==e.keyCode&&n._k(e.keyCode,"delete",[8,46],e.key,["Backspace","Delete","Del"])?null:e.shiftKey?void(n.a?n.b:n.counter+=1):null}}}),n._v(" "),t("div",{on:{"~!click":function(e){return n.doThis(e)}}},[n._v("...")]),n._v(" "),t("div",{nativeOn:{click:function(e){return n.onclick(n.$enevt)}}}),n._v(" "),t("div",{on:{click:function(e){return e.stopPropagation(),n.onclick(n.$enevt)}}})])};`)).toMatchSnapshot()
})



