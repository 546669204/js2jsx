(async function(){
    await import(/* webpackChunkName: "vue-static" */ './src/vue/static.vue');
    await import(/* webpackChunkName: "vue-syntax" */ './src/vue/syntax.vue');
    await import(/* webpackChunkName: "vue-for" */ './src/vue/v-for.vue');
    await import(/* webpackChunkName: "vue-if" */ './src/vue/v-if.vue');
    await import(/* webpackChunkName: "vue-model" */ './src/vue/v-model.vue');
    await import(/* webpackChunkName: "vue-custom-directive" */ './src/vue/custom-directive.vue');
    await import(/* webpackChunkName: "vue-dynamic-components" */ './src/vue/dynamic-components.vue');
    await import(/* webpackChunkName: "vue-event" */ './src/vue/event.vue');
    await import(/* webpackChunkName: "vue-slot" */ './src/vue/slot.vue');
    await import(/* webpackChunkName: "vue-show" */ './src/vue/v-show.vue');
})()


(async function(){
    await import(/* webpackChunkName: "react-jsx" */ './src/react/index.jsx');
})()
