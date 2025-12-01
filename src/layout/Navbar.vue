<template>
  <nav>
    <ul>
      <router-link to="/login" class="nav-link">Login</router-link>
      <li><a href="/dashboard" class="nav-link">Games</a></li>
    </ul>
    <div class="search-bar">
      <input
        type="text"
        placeholder="Buscar jogos..."
        :value="searchStore.searchText"
        @input="event => searchStore.updateSearchText(event.target.value)"
      />
      <img src="../assets/lupa-pesquisa.png" alt="Ícone de busca" class="search-icon" />
    </div>
  </nav>
</template>

<script setup>
    import { useSearchStore } from '../stores/searchStore';
    
    const searchStore = useSearchStore();
</script>

<style scoped>
    nav {
    display: flex;
    align-items: center;
    gap: 30px;
    }

    nav ul {
    display: flex;
    list-style: none;
    gap: 20px;
    padding: 0;
    margin: 0;
    }

    .nav-link {
    color: white;
    text-decoration: none;
    transition: color 0.3s;
    }

    .nav-link:hover {
    color: #ccc;
    }

    .search-bar {
    display: flex;
    align-items: center;
    background-color: #ccc;
    border-radius: 5px;
    padding: 5px 10px;
    border-radius: 80px;
    }

    .search-bar input {
    border: none;
    outline: none;
    background: transparent;
    color: black;
    padding: 5px;
    width: 150px;
    }

    .search-bar input::placeholder {
    color: white;
    }

    .search-icon {
    height: 16px;
    }
</style>