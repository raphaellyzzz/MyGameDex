import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useListStore = defineStore('lists', () => {

  const lists = ref(JSON.parse(localStorage.getItem('myUserLists')) || []);

  watch(lists, (newLists) => {
    localStorage.setItem('myUserLists', JSON.stringify(newLists));
  }, { deep: true });

  function createList(title, description) {
    lists.value.push({
      title,
      description,
      games: []
    });
  }

  function deleteList(index) {
    lists.value.splice(index, 1);
  }

  function updateList(index, newTitle, newDesc) {
    if (lists.value[index]) {
      lists.value[index].title = newTitle;
      lists.value[index].description = newDesc;
    }
  }

  function addGameToList(listIndex, game) {
    const list = lists.value[listIndex];

    const exists = list.games.find(g => g.id === game.id);
    
    if (exists) {
      alert("Este jogo já está nesta lista!");
      return;
    }

    list.games.push(game);
  }

  function removeGameFromList(listIndex, gameIndex) {
    lists.value[listIndex].games.splice(gameIndex, 1);
  }

  return { 
    lists, 
    createList, 
    deleteList, 
    updateList, 
    addGameToList, 
    removeGameFromList 
  };
});