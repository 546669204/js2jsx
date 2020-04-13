<template>
  <div>
    <div id="hook-arguments-example" v-demo:foo.a.b="message"></div>

    <input v-focus />
    <div id="baseexample">
      <p>Scroll down the page</p>
      <p v-pin="200">Stick me 200px from the top of the page</p>
    </div>
    <div id="dynamicexample">
      <h3>Scroll down inside this section ↓</h3>
      <p v-pin:[direction]="200">I am pinned onto the page at 200px to the left.</p>
    </div>
    <div v-demo="{ color: 'white', text: 'hello!' }"></div>
  </div>
</template>