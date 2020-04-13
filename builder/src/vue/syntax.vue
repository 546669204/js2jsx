<template>
  <div>
    <span>Message: {{ msg }}</span>
    <span v-once>这个将不会改变: {{ msg }}</span>
    <span v-html="rawHtml"></span>
    <div v-bind:id="dynamicId"></div>
    <button :disabled="isButtonDisabled">Button</button>
    <div v-bind:id="'list-' + id"></div>
    {{ message.split('').reverse().join('') }}
  </div>
</template>
<script>
export default {
  data() {
      return {
          msg:"a123456",
          rawHtml:"<img src='' />",
          id:"hash123456",
          isButtonDisabled:true,
          message:"1,2,3,4"
      }
  }
};
</script>