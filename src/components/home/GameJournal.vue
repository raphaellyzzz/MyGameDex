<template>
  <div class="journal-section">
    <h3 class="section-title">Diário de Jogatina</h3>

    <div class="journal-form">
      <div class="form-row">
        <input 
          v-model="form.title" 
          placeholder="Título (ex: Derrotei o Boss)" 
          class="input-dark title-input" 
        />
        <input 
          v-model="form.date" 
          type="date" 
          class="input-dark date-input" 
        />
      </div>
      
      <textarea 
        v-model="form.comment" 
        placeholder="Escreva sua experiência... (Obrigatório)" 
        class="input-dark textarea"
      ></textarea>

      <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

      <div class="form-actions">
        <button v-if="isEditing" class="btn-cancel" @click="cancelEdit">Cancelar</button>
        <button class="btn-save" @click="saveEntry">
          {{ isEditing ? 'Atualizar' : 'Salvar Registro' }}
        </button>
      </div>
    </div>

    <hr class="divider">

    <div class="entries-list">
      <p v-if="gameEntries.length === 0" class="empty-text">Nenhum registro encontrado para este jogo.</p>
      
      <div v-for="entry in gameEntries" :key="entry.id" class="entry-card">
        <div class="entry-header">
          <span class="entry-date">{{ formatDate(entry.date) }}</span>
          <div class="entry-actions">
            <button class="btn-icon edit" @click="startEdit(entry)" title="Editar">✎</button>
            <button class="btn-icon delete" @click="deleteEntry(entry.id)" title="Excluir">🗑️</button>
          </div>
        </div>
        
        <h4 class="entry-title">{{ entry.title }}</h4>
        <p class="entry-comment">{{ entry.comment }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useJournalStore } from '../../stores/journalStore';

const props = defineProps({
  game: { type: Object, required: true }
});

const store = useJournalStore();
const errorMessage = ref('');
const isEditing = ref(false);
const editingId = ref(null);

const form = ref({
  title: '',
  date: new Date().toISOString().split('T')[0],
  comment: ''
});

const gameEntries = computed(() => store.getEntriesByGame(props.game.id));

function saveEntry() {
  if (!form.value.comment.trim()) {
    errorMessage.value = "Comentário é obrigatório";
    return;
  }
  
  errorMessage.value = '';

  const entryData = {
    gameId: props.game.id,
    gameTitle: props.game.title,
    gameCover: props.game.images.cover,
    title: form.value.title || 'Sem título',
    date: form.value.date,
    comment: form.value.comment
  }; //coment data implementar

  if (isEditing.value) {
    store.updateEntry(editingId.value, entryData);
    isEditing.value = false;
    editingId.value = null;
  } else {
    store.addEntry(entryData);
  }

  form.value.title = '';
  form.value.comment = '';
  form.value.date = new Date().toISOString().split('T')[0];
}

function startEdit(entry) {
  isEditing.value = true;
  editingId.value = entry.id;
  form.value.title = entry.title;
  form.value.date = entry.date;
  form.value.comment = entry.comment;
  errorMessage.value = '';
}

function cancelEdit() {
  isEditing.value = false;
  editingId.value = null;
  form.value.title = '';
  form.value.comment = '';
  errorMessage.value = '';
}

function deleteEntry(id) {
  if(confirm("Deseja excluir esta anotação?")) {
    store.deleteEntry(id);
    alert("Anotação excluída com sucesso");
  }
}

function formatDate(dateString) {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}
</script>

<style scoped>
.journal-section {
  margin-top: 25px;
  background: #181818;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #333;
  font-family: 'Segoe UI', sans-serif;
  color: #ddd;
}

.section-title {
  font-family: 'Jersey 10', sans-serif;
  font-size: 1.6rem;
  color: #4CAF50;
  margin-bottom: 15px;
  border-bottom: 1px solid #4CAF50;
  display: inline-block;
  padding-bottom: 5px;
}

.journal-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-row {
  display: flex;
  gap: 10px;
}

.input-dark {
  background: #252525;
  border: 1px solid #444;
  color: white;
  padding: 10px;
  border-radius: 6px;
  font-family: sans-serif;
  outline: none;
}

.input-dark:focus {
  border-color: #4CAF50;
}

.title-input {
  flex-grow: 1;
}

.date-input {
  width: 150px;
}

.textarea {
  resize: vertical;
  min-height: 80px;
  width: 100%;
}

.error-msg {
  color: #ff4757;
  font-size: 0.9rem;
  font-weight: bold;
  margin: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 5px;
}

.btn-save {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s;
}

.btn-save:hover {
  background: #3e8e41;
}

.btn-cancel {
  background: transparent;
  color: #aaa;
  border: 1px solid #555;
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-cancel:hover {
  color: white;
  border-color: white;
}

.divider {
  border: 0;
  height: 1px;
  background: #333;
  margin: 20px 0;
}

.entries-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 5px;
}

.empty-text {
  color: #666;
  font-style: italic;
  text-align: center;
  margin-top: 10px;
}

.entry-card {
  background: #222;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #4CAF50;
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.entry-date {
  font-size: 0.85rem;
  color: #4CAF50;
  font-weight: bold;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  margin-left: 8px;
  opacity: 0.7;
  transition: 0.2s;
}

.btn-icon:hover {
  opacity: 1;
  transform: scale(1.1);
}

.edit {
  color: #ffc107;
}

.delete {
  color: #ff4757;
}

.entry-title {
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  color: white;
  font-weight: 600;
}

.entry-comment {
  margin: 0;
  color: #ccc;
  font-size: 0.95rem;
  line-height: 1.4;
  white-space: pre-wrap;
}
</style>