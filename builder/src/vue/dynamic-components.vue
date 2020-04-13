<template>
  <div>
    <keep-alive>
      <component v-bind:is="currentTabComponent"></component>
    </keep-alive>
    <component v-bind:is="currentTabComponent"></component>
  </div>
</template>