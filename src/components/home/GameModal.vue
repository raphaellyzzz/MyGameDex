<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-button" @click="$emit('close')">&times;</button>
      
      <div class="game-details">
        <img :src="getCoverImage(game.images.cover)" :alt="game.title" class="modal-cover">
        <div class="info">
          <h1>{{ game.title }}</h1>
          <p class="description">{{ game.short_description }}</p>
          
          <div class="meta-data">
            <div><strong>Desenvolvedor:</strong> {{ game.developer }}</div>
            <div><strong>Publicadora:</strong> {{ game.publisher }}</div>
            <div><strong>Ano de Lançamento:</strong> {{ game.release_year }}</div>
            <div><strong>Nota da Comunidade:</strong> <span class="rating">{{ game.community_rating }} / 5</span></div>
          </div>

          <div class="tags-container">
            <strong>Gêneros:</strong>
            <span v-for="genre in game.genres" :key="genre" class="tag">{{ genre }}</span>
          </div>

          <div class="tags-container">
            <strong>Plataformas:</strong>
            <span v-for="platform in game.platforms" :key="platform" class="tag platform-tag">{{ platform }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    const images = {};
    const modules = import.meta.glob('../../assets/game_covers/*', { eager: true });

    for (const path in modules) {
        const fileName = path.split('/').pop();

        images[fileName] = modules[path].default;
    }

export default {
  name: 'GameModal',
  props: {
    game: {
      type: Object,
      required: true
    }
  },
  emits: ['close'], 
  methods: {
    getCoverImage(imageName) {
      return images[imageName];
    },
  },
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
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background-color: white;
      color: #1C1D1D;
      padding: 35px;
      border-radius: 10px;
      width: 100%;
      max-width: 800px;
      position: relative;
      box-shadow: 0 5px 15px rgba(0,0,0,0.4);
    }

    .close-button {
      position: absolute;
      top: 10px;
      right: 15px;
      font-size: 2rem;
      font-weight: bold;
      color: #888;
      background: none;
      border: none;
      cursor: pointer;
    }
    
    .close-button:hover{
      color: rgb(191, 50, 50);
      transition: ease 0.7s;
    }

    .game-details {
      display: flex;
      gap: 30px;
    }

    .modal-cover {
      width: 200px;
      height: 300px;
      object-fit: cover;
      border-radius: 8px;
    }

    .info {
      flex: 1;
    }

    .info h1 {
      margin-top: 0;
      font-size: 2.5rem;
      font-family: 'Jersey 10', sans-serif;
    }

    .description {
      font-size: 1rem;
      line-height: 1.5;
      margin-bottom: 20px;
    }

    .meta-data {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 20px;
      font-size: 0.9rem;
    }

    .rating {
      font-weight: bold;
      color: #DAA520;
    }

    .tags-container {
      margin-bottom: 15px;
    }

    .tag {
      display: inline-block;
      background-color: #eee;
      padding: 5px 10px;
      border-radius: 15px;
      margin-right: 8px;
      margin-top: 5px;
      font-size: 0.85rem;
    }

    .platform-tag {
      background-color: #1C1D1D;
      color: white;
    }
</style>