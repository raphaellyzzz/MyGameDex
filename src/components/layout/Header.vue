<template>
  <header>
    <div class="logo-container">
      <img src="../../assets/logo.png" alt="MyGameDex Logo" class="logo" />
      <span class="logo-text">MyGameDex</span>
    </div>

    <nav>
      <ul>
        <li><a href="#" class="nav-link">Login</a></li>
        <li><a href="#" class="nav-link">Games</a></li>
      </ul>
      <div class="search-bar">
        <input type="text" placeholder="Buscar">
        <img src="../../assets/lupa-pesquisa.png" alt="Ícone de busca" class="search-icon" />
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jersey+10&display=swap');
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 50px; 
  background-color: #1C1D1D;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: white; 
  margin-bottom: 20px;
}

.logo-text {
  font-family: 'Jersey 10', sans-serif;
  font-size: 30px; 
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
    height: 80px;
}

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