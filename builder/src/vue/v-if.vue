<template>

  <div v-if="a">
    123123
    <span v-if="c">dsaqwe</span>
    <div v-else-if="c"></div>
    <div v-else>
      <template v-if="ok">
        <h1>Title</h1>
        <p>Paragraph 1</p>
        <p>Paragraph 2</p>
      </template>
      <video src="123" v-if="b"></video>
      <video src="456" v-else></video>
    </div>
  </div>
</template>


<script>
var o = function () {
  var e = this,
    t = e.$createElement,
    n = e._self._c || t;
  return e.a ? n("div", [
      e._v("\n  123123\n  "),
      e.c ? n("span", [e._v("dsaqwe")]) : e._e(),
      e._v(" "),
      n("div", [
        e.b ? n("video", {attrs: {src: ""}  }) : e._e()
      ])
    ]) : e._e()
};
export default {
  
}
</script>