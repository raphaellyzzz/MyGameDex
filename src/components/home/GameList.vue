<template>
  <section class="game-list-section">
    <div v-for="game in filteredGames" :key="game.id" class="game-card">
      <img :src="getCoverImage(game.images.cover)" :alt="game.title">
    </div>

    <div v-if="filteredGames.length === 0 && searchText" class="no-results">
      <p>Nenhum jogo encontrado para "{{ searchText }}".</p>
    </div>
  </section>
</template>

<script>
  import gamesData from '../../api/games.json';
  import { mapState } from 'pinia';
  import { useSearchStore } from '../../stores/searchStore';

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
    computed: {
      ...mapState(useSearchStore, ['searchText']),

      filteredGames() {
        if (!this.searchText) {
          return this.games;
        }
        
        const query = this.searchText.trim().toLowerCase();

        return this.games.filter(game =>
          game.title.toLowerCase().startsWith(query)
        );
      },
    },
  };
</script>

<style scoped>
.game-list-section {
  display: grid; 
  grid-template-columns: repeat(6, 1fr); 
  gap: 25px; 
  padding: 40px 50px;
  max-width: 1450px;
  margin: 0 auto;
}

.game-card {
  width: 100%; 
  aspect-ratio: 2 / 3; 
  border-radius: 8px;
  overflow: hidden; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.game-card:hover {
  transform: scale(1.05);
}

.game-card img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover; 
}

.no-results {
  grid-column: 1 / -1; 
  text-align: center;
  margin-top: 2rem;
  font-size: 1.2rem;
  color: #ccc;
}
</style>