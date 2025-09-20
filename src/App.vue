<template>
  <div id="app">
    <Header />
    <Banner />
    <Gamelist />
  </div>
</template>

<script>
import Header from './components/layout/Header.vue';
import Banner from './components/home/Banner.vue';
import Gamelist from './components/home/Gamelist.vue';

export default {
  name: 'App',
  components: {
    Header,
    Banner,
    Gamelist
  }
};
</script>

<style>
body {
  font-family: sans-serif;
  background-color: #f0f0f0;
  margin: 0;
  padding: 0;
}
</style>