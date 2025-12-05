import { defineStore } from 'pinia';
import { ref, watch, computed } from 'vue';

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

  const uniqueGamesWithJournal = computed(() => {
    const gamesMap = new Map();
    
    entries.value.forEach(entry => {
      if (!gamesMap.has(entry.gameId)) {
        gamesMap.set(entry.gameId, {
          id: entry.gameId,
          title: entry.gameTitle,
          cover: entry.gameCover,
          lastEntryDate: entry.date
        });

      } else {
          const current = gamesMap.get(entry.gameId);
          if (new Date(entry.date) > new Date(current.lastEntryDate)) {
            current.lastEntryDate = entry.date;
          }
        }
    });
    return Array.from(gamesMap.values()).sort((a, b) => new Date(b.lastEntryDate) - new Date(a.lastEntryDate));
  });

  return {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntriesByGame,
    uniqueGamesWithJournal
  };
});