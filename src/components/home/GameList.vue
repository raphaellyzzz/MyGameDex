<template>
  <section class="game-list-section">
    <div v-for="game in games" :key="game.id" class="game-card">
      <img :src="getCoverImage(game.images.cover)" :alt="game.title">
    </div>
  </section>
</template>

<script>
import gamesData from '../../api/games.json';

const images = {};
const modules = import.meta.glob('../../assets/game_covers/*', { eager: true });

for (const path in modules) {
  const fileName = path.split('/').pop();
  images[fileName] = modules[path].default;
}

export default {
  name: 'GameList',
  data() {
    return {
      games: gamesData,
    };
  },
  methods: {
    getCoverImage(imageName) {
      return images[imageName];
    },
  },
};
</script>

<style scoped>
.game-list-section {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 40px 50px;
}

.game-card {
  width: 200px;
  height: 300px; 
  border-radius: 8px;
  overflow: hidden; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.game-card:hover {
  transform: translateY(-5px);
}

.game-card img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover; 
}
</style>