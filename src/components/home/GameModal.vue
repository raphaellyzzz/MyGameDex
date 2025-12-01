<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-button" @click="$emit('close')">&times;</button>
      
      <div class="game-details">
        <div class="cover-wrapper">
           <img :src="getCoverImage(game.images.cover)" :alt="game.title" class="modal-cover">
        </div>

        <div class="info">
          <h1>{{ game.title }}</h1>
          <p class="description">{{ game.short_description }}</p>
          
          <div class="meta-data">
            <div><strong>Desenvolvedor:</strong> {{ game.developer }}</div>
            <div><strong>Publicadora:</strong> {{ game.publisher }}</div>
            <div><strong>Ano:</strong> {{ game.release_year }}</div>
            <div><strong>Nota:</strong> <span class="rating">{{ game.community_rating }} / 5</span></div>
          </div>

          <div class="tags-row">
            <strong>Gêneros:</strong>
            <div class="tags-list">
              <span v-for="genre in game.genres" :key="genre" class="tag">{{ genre }}</span>
            </div>
          </div>

          <div class="tags-row">
            <strong>Plataformas:</strong>
            <div class="tags-list">
              <span v-for="platform in game.platforms" :key="platform" class="tag platform-tag">{{ platform }}</span>
            </div>
          </div>
          
          <hr class="divider">

          <GameJournal :game="game" />
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

import GameJournal from './GameJournal.vue'; 

const props = defineProps({
  game: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);

function getCoverImage(imageName) {
  return new URL(`../../assets/game_covers/${imageName}`, import.meta.url).href;
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jersey+10&display=swap');

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background-color: #1e1e1e;
  color: #e0e0e0;
  padding: 35px;
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
  border: 1px solid #333;
}

.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #1e1e1e;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 4px;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 2.5rem;
  font-weight: bold;
  color: #888;
  background: none;
  border: none;
  cursor: pointer;
  line-height: 1;
  z-index: 10;
}

.close-button:hover {
  color: #ff4757;
  transition: 0.3s;
}

.game-details {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.cover-wrapper {
  flex-shrink: 0;
}

.modal-cover {
  width: 240px;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.info h1 {
  margin-top: 0;
  font-size: 3rem;
  font-family: 'Jersey 10', sans-serif;
  color: #fff;
  line-height: 1;
  margin-bottom: 10px;
}

.description {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 25px;
  color: #ccc;
}

.meta-data {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 25px;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 8px;
}

.rating {
  font-weight: bold;
  color: #DAA520;
}

.tags-row {
  margin-bottom: 15px;
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  display: inline-block;
  background-color: #333;
  color: #ddd;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  border: 1px solid #444;
}

.platform-tag {
  background-color: #4CAF50;
  color: #fff;
  border-color: #4CAF50;
  font-weight: bold;
}

.divider {
  border: none;
  height: 1px;
  background: #333;
  margin: 30px 0;
  width: 100%;
}
</style>