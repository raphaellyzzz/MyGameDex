<template>
  <header>
    <div class="logo-container">
      <img src="../assets/logo.png" alt="MyGameDex Logo" class="logo" />
      <span class="logo-text">MyGameDex</span>
    </div>

    <Navbar />

  </header>
</template>

<script>
import Navbar from './Navbar.vue'; 

export default {
  name: 'Header',
  components: {
    Navbar
  }
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
</style>