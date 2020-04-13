<template>
  <my-functional-component>
    <!-- 设置备用内容 当default 为空时会启用 -->
    <slot>备用内容</slot>
    <!-- 具名分发 绑定属性 -->
    <slot name="footer" v-bind:user="user"></slot>
    <!-- 旧方式 slot slot-scope -->
    <h1 slot="header">旧插槽</h1>
    <!-- 作用域插槽 -->
    <template slot="default" slot-scope="slotProps">{{ slotProps.msg }}</template>
    <!-- 忽略slot 作用域插槽 参数解构 -->
    <span slot-scope="{ msg }">{{ msg }}</span>
    <!-- 普通元素 -->
    <div class="demo-alert-box">
      <strong>Error!</strong>
      <slot></slot>
    </div>
    <!-- 新推荐语法 2.6.0+ -->
    <template v-slot:default="slotProps">{{ slotProps.user.firstName }} <div v-if="slotProps.user"></div></template>
    <p>second</p>
    <template v-slot:foo>first</template>
    <!-- 独占默认插槽的缩写语法 --> <!-- 解构 -->
    <current-user v-slot:ccc="{ user:{d},user,name }">{{ user.firstName+name+d }}</current-user>
    <!-- 解构 默认值 -->
    <current-user v-slot="{ user = { firstName: 'Guest' } }">{{ user.firstName }}</current-user>
    <!-- 动态插槽名 -->
    <template v-slot:[dynamicSlotName]>...</template>
    <!-- 简写 -->
    <template #header>
      <h1>header1-h1</h1>
      <h2>header1-h2</h2>
    </template>
    <template #header2 >header2</template>
  </my-functional-component>
</template>