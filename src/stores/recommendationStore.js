import { defineStore } from 'pinia';

import gamesData from '../api/games.json'; 

export const useRecommendationStore = defineStore('recommendation', {
  state: () => ({
    allGames: gamesData,
    currentMood: '',
    savedGames: [],
  }),

  getters: {
    availableMoods: (state) => {
      const moodsSet = new Set();
      state.allGames.forEach(game => {
        if (game.moods) {
          game.moods.forEach(m => moodsSet.add(m));
        }
      });
      return Array.from(moodsSet).sort();
    },

    filteredGames: (state) => {
      if (!state.currentMood) return [];
      
      return state.allGames.filter(game => 
        game.moods && game.moods.includes(state.currentMood)
      );
    }
  },

  actions: {
    setMood(mood) {
      this.currentMood = mood;
    },

    saveGameToProfile(game) {
      const alreadySaved = this.savedGames.find(g => g.id === game.id);
      
      if (!alreadySaved) {
        this.savedGames.push(game);
        alert(`${game.title} foi salvo no seu perfil!`);
      } else {
        alert("Este jogo já está na sua lista."); //melhorar conforme criar login!!!!
      }
    }
  }
});