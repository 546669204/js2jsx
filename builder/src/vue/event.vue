<template>
  <div id="example-1">
    <button v-on:click="counter += 1">Add 1</button>
    <p>The button above has been clicked {{ counter }} times.</p>
    <button v-on:click="greet">Greet</button>
    <button v-on:click="say('hi')">Say hi</button>
    <!-- 阻止单击事件继续传播 -->
    <a v-on:click.stop="doThis"></a>

    <!-- 提交事件不再重载页面 -->
    <form v-on:submit.prevent="onSubmit"></form>

    <!-- 修饰符可以串联 -->
    <a v-on:click.stop.prevent="doThat"></a>

    <!-- 只有修饰符 -->
    <form v-on:submit.prevent></form>

    <!-- 添加事件监听器时使用事件捕获模式 -->
    <!-- 即内部元素触发的事件先在此处理，然后才交由内部元素进行处理 -->
    <div v-on:click.capture="doThis">...</div>

    <!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
    <!-- 即事件不是从内部元素触发的 -->
    <div v-on:click.self="doThat">...</div>
    <!-- 点击事件将只会触发一次 -->
    <a v-on:click.once="doThis"></a>
    <!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发 -->
    <!-- 而不会等待 `onScroll` 完成  -->
    <!-- 这其中包含 `event.preventDefault()` 的情况 -->
    <div v-on:scroll.passive="onScroll">...</div>
    <!-- 只有在 `key` 是 `Enter` 时调用 `vm.submit()` -->
    <input v-on:keyup.enter="submit" />
    <input v-on:keyup.page-down="onPageDown" />
    <input v-on:keyup.13="submit" />
    <input v-on:keyup.13.shift.delete="submit" />
    <!-- 三元 -->
     <input v-on:keyup.page-down="a?onPageDown:onPageDown2" />
    <input v-on:keyup.13.shift.delete="a?b:counter += 1" />
    <div v-on:click.capture.once="doThis">...</div>
    <div @click.native="onclick($enevt)"></div>
    <div @click.stop="onclick($enevt)"></div>
  </div>
</template>