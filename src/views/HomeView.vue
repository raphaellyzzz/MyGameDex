<template>
  <div class="home-page">
    <Banner v-if="!searchText" />

    <h2 v-if="searchText" class="results-title">
      Resultados para "{{ searchText }}"
    </h2>

    <GameList />
  </div>
</template>

<script>
import { mapState } from 'pinia';
import { useSearchStore } from '../stores/searchStore';

import Banner from '../components/home/Banner.vue';
import GameList from '../components/home/GameList.vue';

export default {
  name: 'HomeView',
  components: {
    Banner,
    GameList
  },
  computed: {
    ...mapState(useSearchStore, ['searchText']),
  }
};
</script>

<style scoped>
.results-title {
  color: white;
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 20px;
  padding: 0 50px;
}
</style>