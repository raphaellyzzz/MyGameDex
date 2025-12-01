<template>
  <div class="lists-container">
    <h1 class="main-title">Lista Personalizada de Jogos</h1>

    <section class="top-management-area">
      
      <div class="create-block">
        <h3><span class="plus-icon">+</span> Nova Lista</h3>
        <div class="create-inputs">
          <input class="input-dark" v-model="newList.title" placeholder="Título (ex: Zerados 2024)" />
          <input class="input-dark short" v-model="newList.description" placeholder="Descrição curta" />
          <button class="btn-confirm-create" @click="handleCreateList" :disabled="!newList.title">Criar</button>
        </div>
      </div>

      <div class="selector-block">
        <h3>Selecione onde adicionar jogos:</h3>
        
        <div v-if="listStore.lists.length === 0" class="empty-selector-msg">
          Crie sua primeira lista ao lado para começar!
        </div>

        <div class="lists-carousel" v-else>
          <div 
            v-for="(list, index) in listStore.lists" 
            :key="index"
            class="selectable-list-card"
            :class="{ 'active-list': selectedListIndex === index }"
            @click="selectList(index)"
          >
            <div class="card-indicator"></div>
            <h4>{{ list.title }}</h4>
            <p>{{ list.games.length }} jogos</p>
          </div>
        </div>
      </div>
    </section>

    <div class="active-context-banner" :class="{ 'banner-active': selectedListIndex !== null }">
      <p v-if="selectedListIndex === null">Selecione uma lista acima para habilitar os botões de adicionar</p>
      <p v-else>Adicionando jogos para a lista: <strong>{{ listStore.lists[selectedListIndex].title }}</strong></p>
    </div>

    <section class="catalog-section">
      <h2 class="section-title">Catálogo Disponível</h2>
      <div class="games-grid">
        <div
          class="game-card"
          v-for="game in allGames"
          :key="game.id"
        >
          <div class="image-wrapper" @click="openGameDetails(game)" style="cursor: pointer">
             <img :src="getAssetImage(game.images.cover)" class="game-img" />
             <div v-if="isGameInSelectedList(game.id)" class="added-overlay">
                <span>✓ Já na lista</span>
             </div>
          </div>

          <h3>{{ game.title }}</h3>

          <button
            class="btn-dynamic-add"
            @click="addGameToSelectedList(game)"
            :disabled="selectedListIndex === null || isGameInSelectedList(game.id)"
            :class="{ 
              'btn-disabled': selectedListIndex === null,
              'btn-added': isGameInSelectedList(game.id)
            }"
          >
            {{ getAddButtonText(game.id) }}
          </button>
        </div>
      </div>
    </section>

    <hr class="divider" />

    <section class="manage-section">
      <h2 class="section-title">Gerenciar Suas Listas</h2>
      <div v-if="listStore.lists.length === 0" class="empty-msg">Nenhuma lista criada ainda.</div>

      <div class="managable-lists-grid">
        <div
          class="manage-list-card"
          v-for="(list, index) in listStore.lists"
          :key="index"
        >
          <div class="manage-header">
            <div>
              <h2>{{ list.title }}</h2>
              <p class="list-desc">{{ list.description || 'Sem descrição' }}</p>
            </div>
            <div class="actions">
              <button class="btn-icon edit" @click.stop="startEditing(list, index)" title="Editar Título">✎</button>
              <button class="btn-icon delete" @click.stop="deleteList(index)" title="Excluir Lista">🗑️</button>
            </div>
          </div>

          <div class="manage-body">
            <p class="games-count">Jogos na lista: {{ list.games.length }}</p>
            
            <ul class="mini-games-list">
              <li v-if="list.games.length === 0" class="no-games-mini">Lista vazia</li>
              <li v-for="(game, i) in list.games.slice(0, 5)" :key="i" class="mini-game-thumb">
                <img :src="getAssetImage(game.images.cover)" :title="game.title" />
              </li>
              <li v-if="list.games.length > 5" class="more-games-count">
                +{{ list.games.length - 5 }}
              </li>
            </ul>
             
             <button class="btn-manage-games" @click="openManageGames(index)" v-if="list.games.length > 0">
               ⚙️ Gerenciar / Remover Jogos
             </button>
          </div>
        </div>
      </div>
    </section>

    <div class="modal" v-if="editing">
      <div class="modal-content">
        <h2>Editar Detalhes da Lista</h2>
        <input class="input-dark full" v-model="editData.title" placeholder="Novo título" />
        <textarea class="input-dark full textarea" v-model="editData.description" placeholder="Nova descrição"></textarea>

        <div class="modal-actions">
          <button class="btn-confirm-create" @click="confirmEdit">Salvar</button>
          <button class="btn-cancel" @click="cancelEdit">Cancelar</button>
        </div>
      </div>
    </div>

    <div class="modal" v-if="managingGamesIndex !== null">
      <div class="modal-content manage-games-modal">
        <header class="modal-header">
          <h2>Gerenciar: {{ listStore.lists[managingGamesIndex].title }}</h2>
          <button class="btn-close-modal" @click="closeManageGames">✕</button>
        </header>

        <ul class="manage-games-list">
          <li v-for="(game, i) in listStore.lists[managingGamesIndex].games" :key="i" class="manage-game-item">
            <div class="game-info-left">
              <img :src="getAssetImage(game.images.cover)" class="thumb-small" />
              <span>{{ game.title }}</span>
            </div>
            <button class="btn-remove-item" @click="removeGameFromList(managingGamesIndex, i)">
              Remover
            </button>
          </li>
        </ul>
        
        <div class="modal-actions">
          <button class="btn-cancel full-width" @click="closeManageGames">Fechar</button>
        </div>
      </div>
    </div>
    <GameModal 
      v-if="showDetailsModal" 
      :game="selectedGameDetails" 
      @close="showDetailsModal = false" 
    />

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useListStore } from '../stores/listStore';
import gamesData from '../api/games.json';

import GameModal from '../components/home/GameModal.vue';

const showDetailsModal = ref(false);
const selectedGameDetails = ref(null); 

function openGameDetails(game) {
  selectedGameDetails.value = game;
  showDetailsModal.value = true;
}

const listStore = useListStore();
const allGames = ref(gamesData);

const newList = ref({ title: "", description: "" });
const selectedListIndex = ref(null); 

const managingGamesIndex = ref(null);

function getAssetImage(fileName) {
  return new URL(`../assets/game_covers/${fileName}`, import.meta.url).href;
}

function isGameInSelectedList(gameId) {
  if (selectedListIndex.value === null) 
    return false;

  if (!listStore.lists[selectedListIndex.value]) 
    return false;

  const activeList = listStore.lists[selectedListIndex.value];
  
  return activeList.games.some(g => g.id === gameId);
}

function getAddButtonText(gameId) {
  if (selectedListIndex.value === null)
    return "Selecione uma lista acima";

  if (isGameInSelectedList(gameId)) 
    return "Adicionado ✓";

  const listName = listStore.lists[selectedListIndex.value]?.title || '';

  const truncatedName = listName.length > 15 ? listName.substring(0, 12) + '...' : listName;

  return `Adicionar a: ${truncatedName}`;
}

function handleCreateList() {
  if (!newList.value.title.trim()) 
    return;

  listStore.createList(
    newList.value.title, newList.value.description
  );

  newList.value = { 
    title: "", 
    description: "" 
  };

  selectedListIndex.value = listStore.lists.length - 1; 
}

function deleteList(index) {
  if (confirm("Tem certeza que deseja excluir esta lista e seus jogos?")) {
      listStore.deleteList(index);
    if (selectedListIndex.value === index) 
      selectedListIndex.value = null;
    else if (selectedListIndex.value > index) 
      selectedListIndex.value--;
  }
}

function selectList(index) {
  if (selectedListIndex.value === index) 
    selectedListIndex.value = null;
  else 
    selectedListIndex.value = index;
}

function addGameToSelectedList(game) {
  if (selectedListIndex.value === null) 
    return;

  listStore.addGameToList(selectedListIndex.value, game);
}

function openManageGames(index) {
  managingGamesIndex.value = index;
}

function closeManageGames() {
  managingGamesIndex.value = null;
}

function removeGameFromList(listIndex, gameIndex) {
  listStore.removeGameFromList(listIndex, gameIndex);
  if (listStore.lists[listIndex].games.length === 0) {
    closeManageGames(); 
  }
}

const editing = ref(false);
const editIndex = ref(null);

const editData = ref({ 
  title: "", 
  description: "" 
});

function startEditing(list, index) {
  editing.value = true;
  editIndex.value = index;
  editData.value = { 
    title: list.title, 
    description: list.description 
  };
}

function confirmEdit() {
  listStore.updateList(editIndex.value, editData.value.title, editData.value.description);
  editing.value = false;
}

function cancelEdit() {
  editing.value = false;
}
</script>

<style scoped>
.lists-container {
  color: #e0e0e0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

h1, h2, h3, h4 {
  font-family: 'Jersey 10', sans-serif;
  letter-spacing: 1px;
  margin: 0;
}

.main-title {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 40px;
  text-transform: uppercase;
  color: #fff;
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #42b983;
  border-bottom: 2px solid #42b98330;
  padding-bottom: 10px;
  display: inline-block;
}

.divider {
  border: none;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 40px 0;
}

.top-management-area {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
  align-items: stretch;
  flex-wrap: wrap;
}

.create-block {
  flex: 0 0 300px;
  background: rgba(30, 30, 30, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
}

.create-block h3 {
  font-size: 1.4rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  color: #4CAF50;
}

.plus-icon {
  font-size: 1.8rem;
  margin-right: 8px;
  line-height: 1;
}

.create-inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1;
}

.input-dark {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #444;
  background: #121212;
  color: white;
  font-family: sans-serif;
  outline: none;
  transition: border 0.3s;
}

.input-dark:focus {
  border-color: #4CAF50;
}

.input-dark.short {
  flex-grow: 1;
}

.btn-confirm-create {
  background: #4CAF50;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  font-weight: bold;
  font-family: 'Jersey 10', sans-serif;
  font-size: 1.2rem;
  transition: 0.2s;
}

.btn-confirm-create:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-2px);
}

.btn-confirm-create:disabled {
  background: #333;
  color: #666;
  cursor: not-allowed;
}

.selector-block {
  flex: 1;
  background: rgba(20, 20, 20, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.selector-block h3 {
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: #bbb;
}

.empty-selector-msg {
  color: #666;
  font-style: italic;
  margin-top: 20px;
}

.lists-carousel {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding-bottom: 10px;
  scrollbar-width: thin;
  scrollbar-color: #42b983 #222;
}

.lists-carousel::-webkit-scrollbar {
  height: 8px;
}

.lists-carousel::-webkit-scrollbar-track {
  background: #222;
  border-radius: 4px;
}

.lists-carousel::-webkit-scrollbar-thumb {
  background: #42b983;
  border-radius: 4px;
}

.selectable-list-card {
  min-width: 160px;
  background: #2a2a2a;
  border: 2px solid #333;
  padding: 15px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.selectable-list-card:hover {
  border-color: #666;
  background: #333;
  transform: translateY(-3px);
}

.selectable-list-card.active-list {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.15);
  box-shadow: 0 0 15px rgba(76, 175, 80, 0.3);
}

.card-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #555;
  position: absolute;
  top: 10px;
  right: 10px;
  transition: 0.3s;
}

.active-list .card-indicator {
  background: #4CAF50;
  box-shadow: 0 0 8px #4CAF50;
}

.selectable-list-card h4 {
  font-size: 1.2rem;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.selectable-list-card p {
  color: #888;
  font-size: 0.9rem;
  margin: 0;
}

.active-context-banner {
  text-align: center;
  padding: 15px;
  background: #1a1a1a;
  border-radius: 8px;
  border: 1px dashed #444;
  color: #888;
  transition: 0.3s;
  font-weight: 500;
}

.active-context-banner.banner-active {
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid #74ac76;
  color: #4CAF50;
}

.active-context-banner strong {
  color: white;
  font-size: 1.1rem;
  margin-left: 5px;
}

.catalog-section {
  margin-top: 30px;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(180px, 1fr));
  gap: 20px;
  max-height: 500px;
  overflow-y: auto;
  padding: 5px;
}

.game-card {
  background: #1e1e1e;
  padding: 12px;
  border-radius: 12px;
  text-align: center;
  border: 1px solid #333;
  transition: 0.3s;
}

.game-card:hover {
  border-color: #555;
  background: #252525;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 220px;
  margin-bottom: 10px;
  border-radius: 8px;
  overflow: hidden;
}

.game-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.added-overlay {
  position: absolute;
  inset: 0;
  background: rgba(76, 175, 80, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  font-family: 'Jersey 10';
  font-size: 1.2rem;
  backdrop-filter: blur(2px);
}

.game-card h3 {
  font-size: 1.2rem;
  margin: 10px 0;
  height: 1.4em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.btn-dynamic-add {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-family: 'Jersey 10', sans-serif;
  font-size: 1.1rem;
  cursor: pointer;
  transition: 0.2s;
  background: #4CAF50;
  color: white;
}

.btn-dynamic-add:hover:not(:disabled) {
  background: #45a049;
  transform: scale(1.02);
}

.btn-disabled {
  background: #333;
  color: #777;
  cursor: not-allowed;
}

.btn-added {
  background: #222;
  color: #4CAF50;
  border: 1px solid #4CAF50;
  cursor: default;
}

.btn-added:hover {
  transform: none;
  background: #222;
}

.manage-section {
  margin-top: 30px;
}

.managable-lists-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.manage-list-card {
  background: #222;
  border: 1px solid #333;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.manage-header {
  background: #2a2a2a;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #333;
}

.manage-header h2 {
  font-size: 1.5rem;
  color: #fff;
}

.list-desc {
  color: #888;
  font-size: 0.9rem;
  margin-top: 5px;
  font-style: italic;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.2s;
  margin-left: 8px;
}

.btn-icon.edit {
  background: #333;
  color: #ffc107;
}

.btn-icon.edit:hover {
  background: #ffc107;
  color: black;
}

.btn-icon.delete {
  background: #333;
  color: #ff4757;
}

.btn-icon.delete:hover {
  background: #ff4757;
  color: white;
}

.manage-body {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.games-count {
  color: #bbb;
  margin-bottom: 15px;
  font-weight: bold;
}

.mini-games-list {
  display: flex;
  gap: 8px;
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
  flex-wrap: wrap;
}

.mini-game-thumb img {
  width: 45px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #444;
}

.more-games-count {
  width: 45px;
  height: 60px;
  background: #333;
  color: #aaa;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  border: 1px solid #444;
}

.no-games-mini {
  color: #666;
  font-style: italic;
}

.btn-manage-games {
  width: 100%;
  padding: 10px;
  background: #333;
  border: 1px solid #444;
  color: #ddd;
  border-radius: 8px;
  cursor: pointer;
  margin-top: auto;
  font-family: 'Jersey 10';
  font-size: 1.1rem;
  transition: 0.2s;
}

.btn-manage-games:hover {
  background: #444;
  color: white;
  border-color: #666;
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background: #222;
  border: 1px solid #444;
  width: 500px;
  padding: 25px;
  border-radius: 12px;
}

.modal-content h2 {
  text-align: center;
  margin-bottom: 20px;
}

.input-dark.full {
  width: 100%;
  margin-bottom: 10px;
}

.textarea {
  resize: vertical;
  height: 100px;
  font-family: sans-serif;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn-cancel {
  background: transparent;
  border: 1px solid #555;
  color: #aaa;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Jersey 10';
  font-size: 1.2rem;
}

.btn-cancel:hover {
  border-color: #777;
  color: white;
}

.full-width {
  width: 100%;
}

.manage-games-modal {
  width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}

.modal-header {
  padding: 20px;
  background: #2a2a2a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333;
}

.btn-close-modal {
  background: none;
  border: none;
  color: #aaa;
  font-size: 1.5rem;
  cursor: pointer;
}

.manage-games-list {
  list-style: none;
  padding: 20px;
  margin: 0;
  overflow-y: auto;
  flex: 1;
}

.manage-game-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2a2a2a;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  border: 1px solid #333;
}

.game-info-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.thumb-small {
  width: 40px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.btn-remove-item {
  background: #ff475720;
  border: 1px solid #ff4757;
  color: #ff4757;
  padding: 5px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-remove-item:hover {
  background: #ff4757;
  color: white;
}

.empty-msg {
  text-align: center;
  color: #666;
  padding: 20px;
}
</style>