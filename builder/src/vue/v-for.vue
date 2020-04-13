<template>
  <div>
    <div v-for="item in [1,2,3,4]" :key="'a123'+item">{{item}}</div>
    <ul id="v-for-object" class="demo">
      <li v-for="value in object" :key="value">{{ value }}</li>
    </ul>
    <template v-for="item in items">
      <li>{{ item.msg }}</li>
      <li class="divider" role="presentation"></li>
    </template>
  </div>
</template>