<template>
  <div class="home-page">
    <Banner />
    <GameList />
  </div>
</template>

<script>
import Banner from '../components/home/Banner.vue';
import GameList from '../components/home/GameList.vue';

export default {
  name: 'HomeView',
  components: {
    Banner,
    GameList
  }
};
</script>

<!-- <style scoped>

</style> -->