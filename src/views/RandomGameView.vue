<template>
  <div class="random-container">
    <h1 class="main-title">Desafio Aleatório</h1>
    <p class="subtitle">Não sabe o que jogar? Deixe o destino decidir.</p>

    <div class="controls-panel">
      <div class="filter-group">
        <label>Gênero:</label>
        <select v-model="selectedGenre" class="custom-select">
          <option value="">Todos os Gêneros</option>
          <option v-for="g in store.uniqueGenres" :key="g" :value="g">{{ g }}</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Plataforma:</label>
        <select v-model="selectedPlatform" class="custom-select">
          <option value="">Todas as Plataformas</option>
          <option v-for="p in store.uniquePlatforms" :key="p" :value="p">{{ p }}</option>
        </select>
      </div>

      <button 
        class="btn-roll" 
        @click="handleRoll" 
        :disabled="store.isAnimating"
      >
        {{ store.isAnimating ? 'Sorteando...' : 'SORTEAR JOGO' }}
      </button>
    </div>

    <hr class="divider" />

    <div class="result-area">
      
      <div v-if="store.isAnimating" class="loader">
        <div class="spinner">🎲</div>
        <p>Consultando os oráculos...</p>
      </div>

      <div v-else-if="store.error" class="error-msg">
        <h3>❌ {{ store.error }}</h3>
        <p>Tente mudar os filtros e sortear novamente.</p>
      </div>

      <div v-else-if="store.result" class="game-card-wrapper">
        <h2 class="result-title">O destino escolheu:</h2>
        
        <div class="game-card" @click="openGameDetails(store.result)">
          <div class="image-wrapper">
            <img :src="getAssetImage(store.result.images.cover)" :alt="store.result.title" />
          </div>
          
          <div class="card-info">
            <h3>{{ store.result.title }}</h3>
            <p class="meta">{{ store.result.release_year }} • {{ store.result.developer }}</p>
            <div class="tags">
              <span v-for="g in store.result.genres.slice(0,3)" :key="g" class="tag">{{ g }}</span>
            </div>
            <p class="click-hint">Clique para ver detalhes</p>
          </div>
        </div>
      </div>

      <div v-else class="initial-state">
        <p>Configure os filtros acima (ou deixe em branco) e clique em Sortear!</p>
      </div>

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
import { useRandomGameStore } from '../stores/randomGameStore';
import GameModal from '../components/home/GameModal.vue';

const store = useRandomGameStore();

const selectedGenre = ref("");
const selectedPlatform = ref("");

const showModal = ref(false);
const selectedGame = ref(null);

function getAssetImage(fileName) {
  return new URL(`../assets/game_covers/${fileName}`, import.meta.url).href;
}

function handleRoll() {
  store.rollGame(selectedGenre.value, selectedPlatform.value);
}

function openGameDetails(game) {
  selectedGame.value = game;
  showModal.value = true;
}
</script>

<style scoped>
.random-container {
  padding: 30px;
  color: white;
  max-width: 900px;
  margin: 0 auto;
  font-family: 'Segoe UI', sans-serif;
  text-align: center;
}

.main-title {
  font-family: 'Jersey 10', sans-serif;
  font-size: 3rem;
  margin-bottom: 10px;
  color: #fff;
  text-transform: uppercase;
}

.subtitle {
  color: #aaa;
  margin-bottom: 40px;
}

.controls-panel {
  background: #1e1e1e;
  padding: 25px;
  border-radius: 16px;
  border: 1px solid #333;
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  align-items: flex-end;
}

.filter-group {
  text-align: left;
}

.filter-group label {
  display: block;
  margin-bottom: 8px;
  color: #42b983;
  font-weight: bold;
  font-size: 0.9rem;
}

.custom-select {
  padding: 12px;
  border-radius: 8px;
  background: #121212;
  color: white;
  border: 1px solid #444;
  width: 200px;
  font-size: 1rem;
  outline: none;
}

.custom-select:focus {
  border-color: #42b983;
}

.btn-roll {
  padding: 12px 30px;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 8px;
  font-family: 'Jersey 10', sans-serif;
  font-size: 1.4rem;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
  height: 46px;
}

.btn-roll:hover:not(:disabled) {
  background: #e84118;
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(255, 71, 87, 0.4);
}

.btn-roll:disabled {
  background: #555;
  cursor: wait;
}

.divider {
  border: none;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 40px 0;
}

.result-area {
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.initial-state {
  color: #666;
  font-style: italic;
  font-size: 1.2rem;
}

.loader {
  font-size: 1.5rem;
  color: #42b983;
}

.spinner {
  font-size: 4rem;
  animation: spin 1s infinite linear;
  margin-bottom: 15px;
}

.error-msg h3 {
  color: #ff4757;
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.error-msg p {
  color: #aaa;
}

.result-title {
  margin-bottom: 20px;
  font-family: 'Jersey 10';
  font-size: 2rem;
  color: #42b983;
}

.game-card {
  background: #252525;
  border: 2px solid #42b983;
  border-radius: 16px;
  overflow: hidden;
  width: 300px;
  cursor: pointer;
  transition: transform 0.3s;
  box-shadow: 0 0 30px rgba(66, 185, 131, 0.2);
}

.game-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 0 50px rgba(66, 185, 131, 0.4);
}

.image-wrapper {
  width: 100%;
  height: 350px;
  background: #000;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-info {
  padding: 20px;
}

.card-info h3 {
  margin: 0 0 5px;
  font-size: 1.4rem;
  color: white;
}

.meta {
  font-size: 0.9rem;
  color: #aaa;
  margin-bottom: 15px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
  margin-bottom: 15px;
}

.tag {
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #ddd;
}

.click-hint {
  font-size: 0.8rem;
  color: #42b983;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 600px) {
  .controls-panel {
    flex-direction: column;
    align-items: stretch;
  }
  
  .custom-select {
    width: 100%;
  }
  
  .btn-roll {
    width: 100%;
  }
}
</style>