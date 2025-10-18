<template>
  <component :is="layoutComponent">
    <router-view />
  </component>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from './layout/DefaultLayout.vue';
import AuthLayout from './layout/AuthLayout.vue';

const route = useRoute();

const layouts = {
  DefaultLayout,
  AuthLayout,
};

const layoutComponent = computed(() => {
  const layoutName = route.meta.layout || 'DefaultLayout';
  return layouts[layoutName];
});
</script>

<style>
body, html {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background-color: #f0f0f0; 
}
</style>