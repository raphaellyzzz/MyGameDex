import { defineStore } from 'pinia';
import gamesData from '../api/games.json';

export const useRandomGameStore = defineStore('randomGame', {
  state: () => ({
    allGames: gamesData,
    result: null,
    isAnimating: false,
    error: null,
  }),

  getters: {
    uniqueGenres: (state) => {
      const genres = new Set();
      state.allGames.forEach(
        g => g.genres.forEach(genre => genres.add(genre)));
      return Array.from(genres).sort();
    },
    uniquePlatforms: (state) => {
      const platforms = new Set();
      state.allGames.forEach(g => g.platforms.forEach(p => platforms.add(p)));
      return Array.from(platforms).sort();
    }
  },

  actions: {
    rollGame(genre, platform) {
      this.isAnimating = true;
      this.error = null;
      this.result = null;

      let pool = this.allGames;

      if (genre) {
        pool = pool.filter(game => game.genres.includes(genre));
      }
      if (platform) {
        pool = pool.filter(game => game.platforms.includes(platform));
      }

      if (pool.length === 0) {
        this.isAnimating = false;
        this.error = "Nenhum jogo encontrado com estes filtros.";
        return;
      }

      setTimeout(() => {
        let newGame;
        
        if (pool.length === 1) {
          newGame = pool[0];
        } else {
            let attempts = 0;
          do {
            const randomIndex = Math.floor(Math.random() * pool.length);
            newGame = pool[randomIndex];
            attempts++;
          } while (this.result && newGame.id === this.result.id && attempts < 5);
        }

        this.result = newGame;
        this.isAnimating = false;
      }, 600);
    }
  }
});