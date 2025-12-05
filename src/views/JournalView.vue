<template>
  <div class="journal-container">
    <div class="header-area">
      <h1 class="main-title">Diário de Jogatina </h1>
      <button class="btn-new-game" @click="openGameSelector">
        + Adicionar Novo Jogo
      </button>
    </div>

    <div v-if="store.uniqueGamesWithJournal.length === 0" class="empty-state">
      <p>Seu diário está vazio.</p>
      <p class="hint">Comece adicionando um jogo que você está jogando agora!</p>
    </div>

    <div v-else class="games-grid">
      <div 
        v-for="game in store.uniqueGamesWithJournal" 
        :key="game.id" 
        class="journal-game-card"
        @click="openGameJournal(game)"
      >
        <div class="cover-wrapper">
          <img :src="getAssetImage(game.cover)" :alt="game.title">
        </div>
        <div class="card-info">
          <h3>{{ game.title }}</h3>
          <span class="last-update">Última anotação: {{ formatDate(game.lastEntryDate) }}</span>
        </div>
      </div>
    </div>

    <div v-if="showSelectorModal" class="modal-overlay" @click.self="closeSelectorModal">
      <div class="modal-content selector-modal">
        <header>
          <h3>Escolha um jogo</h3>
          <button class="close-btn" @click="closeSelectorModal">✕</button>
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

        <ul class="game-selector-list">
          <li v-for="game in filteredGames" :key="game.id" @click="selectNewGame(game)">
            <img :src="getAssetImage(game.images.cover)" class="thumb">
            <span>{{ game.title }}</span>
          </li>
          <li v-if="filteredGames.length === 0" class="no-results">
            Nenhum jogo encontrado.
          </li>
        </ul>
      </div>
    </div>

    <div v-if="showJournalModal" class="modal-overlay" @click.self="closeJournalModal">
      <div class="modal-content journal-modal">
        <button class="close-btn-absolute" @click="closeJournalModal">✕</button>

        <div v-if="!isWritingMode" class="view-mode">
          <div class="modal-header-game">
            <img :src="getAssetImage(activeGame.cover || activeGame.images.cover)" class="header-cover">
            <div class="header-info">
              <h2>{{ activeGame.title }}</h2>
              <button class="btn-write" @click="startWriting">Registrar nova anotação!</button>
            </div>
          </div>

          <div class="timeline-scroll">
            <div v-if="activeGameEntries.length === 0" class="no-entries">
              Nenhuma anotação ainda. Comece agora!
            </div>
            
            <div v-else v-for="entry in activeGameEntries" :key="entry.id" class="timeline-entry">
              <div class="entry-date-badge">{{ formatDate(entry.date) }}</div>
              <div class="entry-content">
                <h4>{{ entry.title }}</h4>
                <p>{{ entry.comment }}</p>
                <div class="entry-actions">
                  <button @click="editEntry(entry)" class="action-btn">Editar</button>
                  <button @click="deleteEntry(entry.id)" class="action-btn delete">Excluir</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="write-mode">
          <div class="write-layout">
            <div class="write-cover">
               <img :src="getAssetImage(activeGame.cover || activeGame.images.cover)">
            </div>
            <div class="write-form">
              <h3>{{ isEditing ? 'Editar Anotação' : 'Nova Anotação' }}</h3>
              
              <input v-model="form.title" placeholder="Título (ex: Chefão difícil)" class="input-dark">
              <input v-model="form.date" type="date" class="input-dark">
              <textarea v-model="form.comment" placeholder="Anote aqui sua experiência..." class="textarea-dark"></textarea>
              
              <div class="form-buttons">
                <button class="btn-cancel" @click="cancelWriting">Cancelar</button>
                <button class="btn-save" @click="saveEntry">Salvar</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <Transition name="fade">
      <div v-if="showSuccessMessage" class="toast-success">
        A sua informação foi salva!
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useJournalStore } from '../stores/journalStore';
import gamesData from '../api/games.json';

const store = useJournalStore();
const allGames = ref(gamesData);

const showSelectorModal = ref(false);
const showJournalModal = ref(false);
const isWritingMode = ref(false);
const showSuccessMessage = ref(false);

const activeGame = ref(null);
const isEditing = ref(false);
const editingId = ref(null);

const form = ref({ title: '', date: '', comment: '' });
const searchQuery = ref('');

const filteredGames = computed(() => {
  if (!searchQuery.value) return allGames.value;
  const term = searchQuery.value.toLowerCase();
  return allGames.value.filter(game => 
    game.title.toLowerCase().includes(term)
  );
});

const activeGameEntries = computed(() => {
  if (!activeGame.value) return [];
  const id = activeGame.value.gameId || activeGame.value.id; 
  return store.getEntriesByGame(id);
});

function openGameSelector() {
  searchQuery.value = '';
  showSelectorModal.value = true;
}

function closeSelectorModal() {
  showSelectorModal.value = false;
  searchQuery.value = '';
}

function selectNewGame(game) {
  closeSelectorModal();
  activeGame.value = game;
  showJournalModal.value = true;
  const entries = store.getEntriesByGame(game.id);
  if (entries.length === 0) {
    startWriting();
  }
}

function openGameJournal(gameFromStore) {
  activeGame.value = gameFromStore;
  showJournalModal.value = true;
  isWritingMode.value = false;
}

function closeJournalModal() {
  showJournalModal.value = false;
  isWritingMode.value = false;
  activeGame.value = null;
}

function startWriting() {
  isWritingMode.value = true;
  isEditing.value = false;
  form.value = { 
    title: '', 
    date: new Date().toISOString().split('T')[0], 
    comment: '' 
  };
}

function editEntry(entry) {
  isWritingMode.value = true;
  isEditing.value = true;
  editingId.value = entry.id;
  form.value = { ...entry };
}

function cancelWriting() {
  isWritingMode.value = false;
}

function saveEntry() {
  const gameId = activeGame.value.gameId || activeGame.value.id;
  const gameTitle = activeGame.value.gameTitle || activeGame.value.title;
  const cover = activeGame.value.gameCover || activeGame.value.cover || (activeGame.value.images ? activeGame.value.images.cover : '');

  const entryData = {
    gameId: gameId,
    gameTitle: gameTitle,
    gameCover: cover,
    title: form.value.title || 'Sem título',
    date: form.value.date,
    comment: form.value.comment || 'Sem Comentário'
  };

  if (isEditing.value) {
    store.updateEntry(editingId.value, entryData);
  } else {
    store.addEntry(entryData);
  }

  isWritingMode.value = false;
  showSuccessMessage.value = true;
  setTimeout(() => showSuccessMessage.value = false, 3000);
}

function deleteEntry(id) {
  if(confirm("Excluir esta anotação?")) {
    store.deleteEntry(id);
  }
}

function getAssetImage(fileName) {
  if(!fileName) return '';
  return new URL(`../assets/game_covers/${fileName}`, import.meta.url).href;
}

function formatDate(dateString) {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}
</script>

<style scoped>
.journal-container {
  padding: 30px;
  color: white;
  max-width: 1000px;
  margin: 0 auto;
  font-family: 'Segoe UI', sans-serif;
}

.header-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.main-title {
  font-family: 'Jersey 10', sans-serif;
  font-size: 3rem;
  color: #fff;
  margin: 0;
}

.btn-new-game {
  background: #4CAF50;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

.btn-new-game:hover {
  background: #45a049;
  transform: translateY(-2px);
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(200px, 1fr));
  gap: 20px;
}

.journal-game-card {
  background: #1e1e1e;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: 0.3s;
  border: 1px solid #333;
  position: relative;
}

.journal-game-card:hover {
  transform: translateY(-5px);
  border-color: #4CAF50;
}

.cover-wrapper {
  width: 100%;
  height: 250px;
  background: #000;
}

.cover-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-info {
  padding: 15px;
}

.card-info h3 {
  margin: 0 0 5px 0;
  font-size: 1.2rem;
}

.last-update {
  font-size: 0.8rem;
  color: #888;
}

.empty-state {
  text-align: center;
  padding: 50px;
  border: 2px dashed #333;
  border-radius: 12px;
  color: #888;
}

.hint {
  color: #4CAF50;
  margin-top: 10px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  backdrop-filter: blur(5px);
}

.selector-modal {
  background: #222;
  width: 400px;
  max-height: 80vh;
  border-radius: 12px;
  border: 1px solid #444;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.selector-modal header {
  padding: 15px;
  background: #1a1a1a;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #333;
  align-items: center;
}

.close-btn {
  background: transparent;
  border: none;
  color: #aaa;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: 0.2s;
}
.close-btn:hover {
  color: #ff4757;
  background: rgba(255, 255, 255, 0.05);
}

.game-selector-list {
  list-style: none;
  padding: 0;
  overflow-y: auto;
  flex: 1;
}

.game-selector-list li {
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  border-bottom: 1px solid #333;
  cursor: pointer;
  transition: 0.2s;
}

.game-selector-list li:hover {
  background: #333;
  padding-left: 20px;
}

.thumb {
  width: 40px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.journal-modal {
  background: #1e1e1e;
  width: 800px;
  height: 80vh;
  border-radius: 12px;
  border: 1px solid #333;
  position: relative;
  overflow: hidden;
  display: flex;
}

.close-btn-absolute {
  position: absolute;
  top: 15px;
  right: 20px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #444;
  color: #fff;
  font-size: 1.2rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.close-btn-absolute:hover {
  background: #ff4757;
  border-color: #ff4757;
  transform: rotate(90deg) scale(1.1); 
  color: white;
}

.view-mode {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.modal-header-game {
  padding: 30px;
  background: linear-gradient(to right, #1a1a1a, #252525);
  display: flex;
  gap: 20px;
  align-items: center;
  border-bottom: 1px solid #333;
}

.header-cover {
  width: 80px;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}

.header-info h2 {
  font-size: 2.5rem;
  font-family: 'Jersey 10';
  margin: 0 0 10px 0;
}

.btn-write {
  background: #4CAF50;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-weight: bold;
}

.btn-write:hover {
  background: #45a049;
}

.timeline-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
  background: #181818;
}

.no-entries {
  text-align: center;
  color: #666;
  margin-top: 50px;
  font-style: italic;
}

.timeline-entry {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.entry-date-badge {
  min-width: 100px;
  text-align: right;
  color: #4CAF50;
  font-weight: bold;
  font-size: 0.9rem;
  padding-top: 5px;
}

.entry-content {
  flex: 1;
  background: #222;
  padding: 20px;
  border-radius: 0 12px 12px 12px;
  border: 1px solid #333;
  position: relative;
}

.entry-content h4 {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  color: white;
}

.entry-content p {
  color: #ccc;
  line-height: 1.5;
  white-space: pre-wrap;
  margin-bottom: 15px;
}

.entry-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.action-btn {
  background: #333;
  border: none;
  color: #aaa;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.action-btn:hover {
  background: #444;
  color: white;
}

.action-btn.delete:hover {
  color: #ff4757;
}

.write-mode {
  width: 100%;
  height: 100%;
  background: #181818;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.write-layout {
  display: flex;
  gap: 30px;
  width: 100%;
  max-width: 700px;
}

.write-cover img {
  width: 200px;
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
}

.write-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.write-form h3 {
  margin: 0 0 10px 0;
  font-size: 1.5rem;
  color: #4CAF50;
}

.input-dark {
  background: #222;
  border: 1px solid #444;
  padding: 12px;
  color: white;
  border-radius: 6px;
  width: 100%;
  outline: none;
}

.search-box {
  padding: 15px 20px; 
  border-bottom: 1px solid #333; 
  background: #1e1e1e; 
}

.search-input {
  width: 100%;
  box-sizing: border-box; 
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #444;
  background: #121212; 
  color: white;
  font-family: 'Segoe UI', sans-serif;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  border-color: #4CAF50; 
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2); 
}

.search-input::placeholder {
  color: #666;
  font-style: italic;
}

.textarea-dark {
  background: #222;
  border: 1px solid #444;
  padding: 12px;
  color: white;
  border-radius: 6px;
  width: 100%;
  height: 150px;
  resize: none;
  outline: none;
}

.form-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 10px;
}

.btn-save {
  background: #4CAF50;
  border: none;
  padding: 10px 25px;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.btn-cancel {
  background: transparent;
  border: 1px solid #555;
  padding: 10px 20px;
  border-radius: 6px;
  color: #aaa;
  cursor: pointer;
}

.toast-success {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #4CAF50;
  color: white;
  padding: 15px 30px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  font-weight: bold;
  z-index: 2000;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>