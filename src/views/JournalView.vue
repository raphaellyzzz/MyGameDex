<template>
  <div class="journal-container">
    <h1 class="main-title">Meu Diário de Jogatina</h1>

    <div v-if="store.entries.length === 0" class="empty-state">
      <p>Você ainda não registrou nenhuma memória.</p>
      <p class="hint">Vá até a página de um jogo e adicione uma anotação!</p>
    </div>

    <div v-else class="timeline">
      <div v-for="entry in sortedEntries" :key="entry.id" class="timeline-item">
        
        <div class="game-thumb">
          <img :src="getAssetImage(entry.gameCover)" :alt="entry.gameTitle">
        </div>

        <div class="content">
          <div class="header">
            <h3>{{ entry.gameTitle }}</h3>
            <span class="date">{{ formatDate(entry.date) }}</span>
          </div>
          
          <h4 class="entry-title">{{ entry.title }}</h4>
          <p class="entry-body">{{ entry.comment }}</p>
          
          <div class="actions">
            <button @click="deleteEntry(entry.id)" class="btn-delete">Excluir Registro</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useJournalStore } from '../stores/journalStore';

const store = useJournalStore();

const sortedEntries = computed(() => {
  return [...store.entries].sort((a, b) => new Date(b.date) - new Date(a.date));
});

function getAssetImage(fileName) {
  if (!fileName) 
    return '';
  return new URL(`../assets/game_covers/${fileName}`, import.meta.url).href;
}

function formatDate(dateString) {
  if (!dateString) 
    return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

function deleteEntry(id) {
  if(confirm("Tem certeza que deseja apagar este registro do diário?")) {
    store.deleteEntry(id);
  }
}
</script>

<style scoped>
.journal-container {
  padding: 30px;
  color: white;
  max-width: 900px;
  margin: 0 auto;
  font-family: 'Segoe UI', sans-serif;
}

.main-title {
  font-family: 'Jersey 10', sans-serif;
  font-size: 3rem;
  text-align: center;
  margin-bottom: 40px;
  color: #fff;
}

.empty-state {
  text-align: center;
  padding: 50px;
  border: 2px dashed #333;
  border-radius: 12px;
  color: #888;
}
.hint { font-size: 0.9rem; color: #42b983; margin-top: 10px; }

.timeline-item {
  display: flex;
  background: #1e1e1e;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 25px;
  border: 1px solid #333;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  transition: transform 0.2s;
}
.timeline-item:hover { 
  transform: translateY(-3px); 
  border-color: #42b983; 
}

.game-thumb {
  width: 120px;
  min-width: 120px;
  background: #000;
}
.game-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.header h3 { 
  margin: 0; 
  color: #42b983; 
  font-size: 1.2rem; 
}
.date { 
  font-size: 0.85rem; 
  color: #ccc; 
  background: #2a2a2a; 
  padding: 4px 8px; 
  border-radius: 4px; }

.entry-title {
  margin: 0 0 10px 0; 
  font-size: 1.3rem; 
  color: #fff; 
  font-weight: 600; 
}

.entry-body { 
  color: #ccc; 
  line-height: 1.5; 
  white-space: pre-wrap; 
  flex: 1; }

.actions { 
  margin-top: 15px; 
  text-align: right; 
}
.btn-delete {
  background: transparent;
  border: 1px solid #ff4757;
  color: #ff4757;
  padding: 5px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: 0.2s;
}
.btn-delete:hover {
  background: #ff4757; 
  color: white; 
}
</style>