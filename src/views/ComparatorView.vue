<template>
  <div class="comparator-container">
    
    <div class="header-text">
      <h1>Arena de Títulos ⚔️</h1>
      <p v-if="!store.winner">
        Coloque os jogos frente a frente e escolha o vencedor.
      </p>
      <p v-else class="winner-text">
        Temos um campeão! Reiniciando a arena...
      </p>
    </div>

    <div class="arena">
      <div 
        class="fighter-slot" 
        :class="{ 
          'winner': store.winner === 'left', 
          'loser': store.winner === 'right',
          'empty': !store.slot1 
        }"
      >
        <div v-if="store.slot1" class="fighter-card">
          <button class="btn-remove" @click="store.removeGame(1)" title="Remover">✕</button>
          
          <div class="image-box">
             <img :src="getAssetImage(store.slot1.images.cover)" :alt="store.slot1.title" />
          </div>
          
          <h2>{{ store.slot1.title }}</h2>
          
          <div class="card-body">
            <div class="stats" v-if="store.winner !== 'right'">
              <div class="stat-line">
                  <strong>Gêneros:</strong> {{ store.slot1.genres.slice(0, 2).join(', ') }}
              </div>
              <div class="stat-line">
                  <strong>Plat:</strong> {{ store.slot1.platforms.slice(0, 2).join(', ') }}
              </div>
              <p class="desc">{{ store.slot1.short_description }}</p>
            </div>
          </div>

          <button 
            class="btn-choose" 
            @click="store.declareWinner(1)" 
            v-if="!store.winner"
          >
            ESCOLHER ESTE
          </button>
        </div>

        <div v-else class="empty-state" @click="openSelectionModal(1)">
          <span class="plus-icon">+</span>
          <p>Selecionar Lutador 1</p>
        </div>
      </div>

      <div class="vs-badge" v-if="!store.winner">VS</div>

      <div 
        class="fighter-slot" 
        :class="{ 
          'winner': store.winner === 'right', 
          'loser': store.winner === 'left',
          'empty': !store.slot2 
        }"
      >
        <div v-if="store.slot2" class="fighter-card">
          <button class="btn-remove" @click="store.removeGame(2)" title="Remover">✕</button>
          
          <div class="image-box">
             <img :src="getAssetImage(store.slot2.images.cover)" :alt="store.slot2.title" />
          </div>
          
          <h2>{{ store.slot2.title }}</h2>
          
          <div class="card-body">
            <div class="stats" v-if="store.winner !== 'left'">
               <div class="stat-line">
                  <strong>Gêneros:</strong> {{ store.slot2.genres.slice(0, 2).join(', ') }}
              </div>
              <div class="stat-line">
                  <strong>Plat:</strong> {{ store.slot2.platforms.slice(0, 2).join(', ') }}
              </div>
              <p class="desc">{{ store.slot2.short_description }}</p>
            </div>
          </div>

          <button 
            class="btn-choose" 
            @click="store.declareWinner(2)" 
            v-if="!store.winner"
          >
            ESCOLHER ESTE
          </button>
        </div>

        <div v-else class="empty-state" @click="openSelectionModal(2)">
          <span class="plus-icon">+</span>
          <p>Selecionar Lutador 2</p>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <header>
          <h3>Escolher Oponente {{ targetSlot }}</h3>
          <button class="close-modal" @click="closeModal">✕</button>
        </header>

        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Buscar jogo..." 
            class="search-input"
            autofocus
          />
        </div>

        <ul class="game-list">
          <li v-for="game in filteredGames" :key="game.id" @click="confirmSelection(game.id)">
            <img :src="getAssetImage(game.images.cover)" class="thumb" />
            <span>{{ game.title }}</span>
          </li>
          
          <li v-if="filteredGames.length === 0" class="no-results">
            Nenhum jogo encontrado.
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useComparatorStore } from '../stores/comparatorStore';

const store = useComparatorStore();
const showModal = ref(false);
const targetSlot = ref(1);
const searchQuery = ref('');

const filteredGames = computed(() => {
  if (!searchQuery.value) {
    return store.allGames;
  }
  const term = searchQuery.value.toLowerCase();
  return store.allGames.filter(game => 
    game.title.toLowerCase().includes(term)
  );
});

function getAssetImage(fileName) {
  return new URL(`../assets/game_covers/${fileName}`, import.meta.url).href;
}

function openSelectionModal(slot) {
  targetSlot.value = slot;
  searchQuery.value = '';
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  searchQuery.value = '';
}

function confirmSelection(gameId) {
  store.selectGame(targetSlot.value, gameId);
  closeModal();
}
</script>

<style scoped>
.comparator-container {
  padding: 2rem;
  color: white;
  max-width: 1100px;
  margin: 0 auto;
}

.header-text {
  text-align: center;
  margin-bottom: 30px;
}

.header-text h1 {
  font-size: 2.5rem;
  text-transform: uppercase;
  margin-bottom: 10px;
  font-family: 'Jersey 10', sans-serif;
  letter-spacing: 2px;
}

.subtitle {
  color: #aaa;
  font-size: 1.1rem;
}

.winner-text {
  color: #4CAF50;
  font-weight: bold;
  font-size: 1.2rem;
  margin-top: 10px;
  animation: pulse 1s infinite;
}

.arena {
  display: flex;
  justify-content: center;
  gap: 30px;
  position: relative;
  align-items: stretch;
}

.vs-badge {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 4rem;
  font-weight: 900;
  color: #ff4757;
  text-shadow: 3px 3px 0 #000;
  z-index: 10;
  font-family: 'Jersey 10', sans-serif;
  pointer-events: none;
}

.fighter-slot {
  flex: 1;
  max-width: 280px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.5s ease;
}

.fighter-slot.winner {
  transform: scale(1.05);
  z-index: 5;
}

.fighter-slot.winner .fighter-card {
  border: 2px solid #ffd700;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
}

.fighter-slot.loser {
  opacity: 0.4;
  transform: scale(0.95);
  filter: grayscale(100%);
}

.empty-state {
  min-height: 480px; 
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  color: #666;
  transition: 0.3s;
}

.empty-state:hover {
  border-color: #42b983;
  color: #fff;
  background: rgba(66, 185, 131, 0.1);
}

.plus-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

.fighter-card {
  flex: 1;
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  position: relative;
}

.card-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.image-box {
  width: 100%;
  aspect-ratio: 2 / 3;
  background: #000;
  border-radius: 8px;
  margin-bottom: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.5);
  flex-shrink: 0;
}

.image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

h2 {
  text-align: center;
  font-size: 1.4rem;
  margin-bottom: 10px;
  color: #fff;
  font-family: 'Jersey 10', sans-serif;
  letter-spacing: 1px;
  flex-shrink: 0;
}

.stats {
  background: rgba(255,255,255,0.03);
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 0.9rem;
  flex-grow: 1;
}

.stat-line {
  margin-bottom: 5px;
  color: #ccc;
}

.stat-line strong {
  color: #42b983;
}

.desc {
  margin-top: 10px;
  color: #888;
  font-style: italic;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.btn-remove {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0,0,0,0.6);
  border: 1px solid #ff4757;
  color: #ff4757;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove:hover {
  background: #ff4757;
  color: white;
}

.btn-choose {
  width: 100%;
  padding: 12px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  margin-top: auto;
  transition: 0.2s;
  font-family: 'Jersey 10', sans-serif;
  flex-shrink: 0;
}

.btn-choose:hover {
  background: #3aa876;
  transform: scale(1.02);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background: #222;
  width: 400px;
  border-radius: 10px;
  border: 1px solid #333;
  overflow: hidden;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-content header {
  padding: 15px;
  background: #1a1a1a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333;
}

.close-modal {
  background: none;
  border: none;
  color: #aaa;
  font-size: 1.2rem;
  cursor: pointer;
}

.search-box {
  padding: 10px 15px;
  border-bottom: 1px solid #333;
  background: #1e1e1e;
}

.search-input {
  width: 100%;
  box-sizing: border-box; 
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #444;
  background: #111;
  color: white;
  font-family: 'Jersey 10', sans-serif;
  font-size: 1.1rem;
  outline: none;
}

.search-input:focus {
  border-color: #42b983;
}

.game-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
}

.game-list li {
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  border-bottom: 1px solid #333;
  cursor: pointer;
  transition: 0.2s;
}

.game-list li:hover {
  background: #2a2a2a;
  padding-left: 20px;
}

.thumb {
  width: 40px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.no-results {
  padding: 20px;
  text-align: center;
  color: #777;
  font-style: italic;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
</style>