<template>
  <div class="dashboard">
    <aside class="sidebar">
      <h2 class="sidebar-title" @click="activeComponent = GameList">Funcionalidades</h2>
      
      <ul>
        <li 
          v-for="feature in features" 
          :key="feature.title" 
          class="sidebar-item"
          :class="{ 'active': activeComponent === feature.component }"
          @click="selectFeature(feature)"
        >
          {{ feature.title }}
        </li>
      </ul>
    </aside>

    <main class="main-content">
      <component :is="activeComponent" v-if="activeComponent" />
      

    </main>
  </div>
</template>

<script setup>
  import { ref, shallowRef } from 'vue'

  import GameList from '../components/home/GameList.vue';
  import RecommendationsView from './RecommendationsView.vue'; 

  const userName = ref(localStorage.getItem('userName') || 'Usuário')

  // shallowRef é melhor que ref para guardar componentes inteiros, pois melhora performance. o vue não tenta monitorar o código interno do componente
  const activeComponent = shallowRef(GameList) 

  const features = [

    { title: 'Recomendações por Mood', component: RecommendationsView },
    { title: 'Comparar Jogos', component: null },
    { title: 'Listas Personalizadas', component: null },
    { title: 'Mapa de Gêneros', component: null },
    { title: 'Conquistas', component: null },
    { title: 'Ranking', component: null },
    { title: 'Desafio Aleatório', component: null },
    { title: 'Diário de Jogatina', component: null },
    { title: 'Sair', action: 'logout' }
  ]

  function selectFeature(feature) {
    if (feature.title === 'Sair') {
      alert('Saindo...')
      return
    }

    activeComponent.value = feature.component
  }
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
    cursor: pointer; 
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

  .sidebar-item.active {
    background: #4CAF50; 
    color: black;
    font-weight: bold;
  }

  .main-content {
    flex: 1;
    display: flex; 
    flex-direction: column;
    padding: 20px;
    overflow-y: auto; 
    max-height: 100vh;
  }
</style>