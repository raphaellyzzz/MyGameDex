import { defineStore } from 'pinia';
import gamesData from '../api/games.json'; 

export const useComparatorStore = defineStore('comparator', {
  state: () => ({
    allGames: gamesData,
    slot1: null,
    slot2: null,
    winner: null,
  }),

  actions: {
    selectGame(slotNumber, gameId) {
      const game = this.allGames.find(g => g.id === gameId);
      this.winner = null; 

      if (slotNumber === 1) 
        this.slot1 = game;

      else 
        this.slot2 = game;
    },

    removeGame(slotNumber) {
      if (slotNumber === 1) 
        this.slot1 = null;
      else 
        this.slot2 = null;

      this.winner = null;
    },

    declareWinner(slotNumber) {
      if (!this.slot1 || !this.slot2) 
        return;
      this.winner = slotNumber === 1 ? 'left' : 'right';

      setTimeout(() => {
        this.winner = null;
        this.slot1 = null;
        this.slot2 = null;
      }, 1500);
    }
  }
});