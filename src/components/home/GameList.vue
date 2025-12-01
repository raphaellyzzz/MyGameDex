<template>
  <section class="game-list-section">
    <div 
      v-for="game in filteredGames" 
      :key="game.id" 
      class="game-card"
      @click="openModal(game)"
    >
      <img :src="getCoverImage(game.images.cover)" :alt="game.title">
      <div class="overlay">
        <span class="game-title">{{ game.title }}</span>
      </div>
    </div>

    <div v-if="filteredGames.length === 0 && searchText" class="no-results">
      <p>Nenhum jogo encontrado para "{{ searchText }}".</p>
    </div>

    <GameModal 
      v-if="selectedGame" 
      :game="selectedGame" 
      @close="closeModal" 
    />
  </section>
</template>

<script>
  import gamesData from '../../api/games.json';
  import { mapState } from 'pinia';
  import { useSearchStore } from '../../stores/searchStore';
  import GameModal from './GameModal.vue';

  const images = {};
  const modules = import.meta.glob('../../assets/game_covers/*', { eager: true });
  
  for (const path in modules) {
    const fileName = path.split('/').pop();
    images[fileName] = modules[path].default;
  }

  export default {
    name: 'GameList',
    components: {
      GameModal 
    },
    data() {
      return {
        games: gamesData,
        selectedGame: null 
      };
    },
    methods: {
      getCoverImage(imageName) {
        return images[imageName];
      },

      openModal(game) {
        this.selectedGame = game;
      },

      closeModal() {
        this.selectedGame = null;
      }
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
    width: 100%; 
    box-sizing: border-box; 
    display: grid; 
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 25px; 
    padding: 30px;
    max-width: 1600px;
    margin: 0 auto;
  }

  .game-card {
    width: 100%; 
    aspect-ratio: 2 / 3; 
    border-radius: 8px;
    overflow: hidden; 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
    position: relative; 
    cursor: pointer;
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

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0; 
    transition: opacity 0.3s ease;
    text-align: center;
  }

  .game-title {
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    padding: 10px;
    font-family: 'Jersey 10', sans-serif;
  }

  .game-card:hover .overlay {
    opacity: 1; 
  }

  .no-results {
    grid-column: 1 / -1; 
    text-align: center;
    margin-top: 2rem;
    font-size: 1.2rem;
    color: black;
    font-weight: bold;
  }
</style>