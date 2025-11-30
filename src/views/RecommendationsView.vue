<template>
  <div class="recommendations-container">
    <h1>Recomendações por Humor</h1>
    <p class="subtitle">Como você quer se sentir hoje?</p>

    <div class="mood-buttons">
      <button 
        v-for="mood in store.availableMoods" 
        :key="mood"
        @click="store.setMood(mood)"
        :class="{ active: store.currentMood === mood }"
        class="btn-mood"
      >
        {{ mood }}
      </button>
    </div>

    <div v-if="store.currentMood" class="results-area">
      <h2>
        Jogos com vibe: <span>{{ store.currentMood }}</span>
      </h2>
      
      <div v-if="store.filteredGames.length > 0" class="games-grid">
        <div 
            v-for="game in store.filteredGames" 
            :key="game.id" 
            class="game-card"
            @click="openGameDetails(game)"
        >
          <div class="card-image">
                <img 
                    :src="getCoverUrl(game.images.cover)" 
                    :alt="game.title" 
                    class="w-full h-48 object-cover opacity-80 hover:opacity-100 transition-opacity"
                />
          </div>
          
          <div class="card-content">
            <h3>{{ game.title }}</h3>
            <p class="game-meta">{{ game.release_year }} • {{ game.genres.join(', ') }}</p>
            <p class="description">{{ game.short_description }}</p>
            
            <button class="btn-save" @click.stop="store.saveGameToProfile(game)">Salvar no Perfil</button>
          </div>
        </div>
      </div>

      <div v-else class="no-results">
        <p>Nenhum jogo encontrado para este humor.</p>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>Selecione um botão acima para começar.</p>
    </div>

    <GameModal 
      v-if="showModal" 
      :game="selectedGame" 
      @close="showModal = false" 
    />

  </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { useRecommendationStore } from '../stores/recommendationStore';
    import GameModal from '../components/home/GameModal.vue';

    const store = useRecommendationStore();
    const showModal = ref(false);
    const selectedGame = ref(null);

    const getCoverUrl = (fileName) => {
        return new URL(`../assets/game_covers/${fileName}`, import.meta.url).href;
    };

    const openGameDetails = (game) => {
        selectedGame.value = game;
        showModal.value = true;
    };
</script>

<style scoped>
    .recommendations-container {
    padding: 2rem;
    color: #fff; 
    }

    .mood-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 12px; 
    justify-content: center; 
    margin-bottom: 30px;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    }

    .btn-mood {
    padding: 10px 20px;
    background-color: #333;
    border: 1px solid #555;
    color: white;
    border-radius: 20px;
    cursor: pointer;
    transition: 0.3s;
    }

    .btn-mood:hover {
    border-color: #42b983; 
    }

    .btn-mood.active {
    background-color: #42b983;
    color: #000;
    font-weight: bold;
    }

    .games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    }

    .game-card {
    background: #1e1e1e;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #333;
    cursor: pointer;
    transition: transform 0.2s ease;
    }

    .game-card:hover {
        transform: translateY(-5px);
        border-color: #42b983;
    }

    .card-image img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    }

    .card-content {
    padding: 15px;
    }

    .game-meta {
    font-size: 0.8rem;
    color: #aaa;
    margin-bottom: 10px;
    }

    .description {
    font-size: 0.9rem;
    margin-bottom: 15px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    }

    .btn-save {
    width: 100%;
    padding: 8px;
    background-color: #ff4757;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    }

    .btn-save:hover {
    background-color: #e84118;
    }
</style>