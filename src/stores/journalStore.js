import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useJournalStore = defineStore('journal', () => {
  const entries = ref(JSON.parse(localStorage.getItem('gameJournal')) || []);

  watch(entries, (newEntries) => {
    localStorage.setItem('gameJournal', JSON.stringify(newEntries));
  }, { deep: true });

  function addEntry(entry) {
    const newEntry = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...entry
    };
    entries.value.push(newEntry);
  }

  function updateEntry(id, updatedFields) {
    const index = entries.value.findIndex(e => e.id === id);
    if (index !== -1) {
      entries.value[index] = { ...entries.value[index], ...updatedFields };
    }
  }

  function deleteEntry(id) {
    const index = entries.value.findIndex(e => e.id === id);
    if (index !== -1) {
      entries.value.splice(index, 1);
    }
  }
  
  function getEntriesByGame(gameId) {
    return entries.value
      .filter(e => e.gameId === gameId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  return {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntriesByGame
  };
});