<template>
  <div class="dashboard">
    <aside class="sidebar">
      <h2 class="sidebar-title">Funcionalidades</h2>
      <ul>
        <li v-for="feature in features" :key="feature.title" class="sidebar-item">
          {{ feature.title }}
        </li>
      </ul>
    </aside>

    <main class="main-content">
      

      <GameList />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GameModal from '../components/home/GameModal.vue';
import GameList from '../components/home/GameList.vue';

const userName = ref(localStorage.getItem('userName') || 'Usuário')

const features = ref([
  { title: 'Comparar Jogos' },
  { title: 'Listas Personalizadas' },
  { title: 'Mapa de Gêneros' },
  { title: 'Conquistas' },
  { title: 'Ranking' },
  { title: 'Desafio Aleatório' },
  { title: 'Diário de Jogatina'},
  { title: 'Sair' }
])
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jersey+10&display=swap');

.dashboard {
  display: flex;
  min-height: 100vh;
  background-color: #121212;
  color: white;
  font-family: 'Jersey 10', sans-serif;
}

.sidebar {
  width: 320px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  padding: 40px 25px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-title {
  font-size: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 12px;
  margin-bottom: 10px;
  text-align: center;
  letter-spacing: 1px;
}

.sidebar-item {
  list-style: none;
  padding: 15px 20px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 10px;
  margin-right: 35px;
}

.sidebar-item:hover {
  background: rgba(255, 255, 255, 0.18);
  transform: translateX(5px);
}

.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.welcome-text h1 {
  font-size: 2.8rem;
  margin-bottom: 15px;
  letter-spacing: 1px;
}

.subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.2rem;
}
</style>
