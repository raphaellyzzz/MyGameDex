<template>
  <div class="dashboard-page">
    <div class="dashboard-box">
      <h1>Bem-vindo(a), {{ userName }}</h1>
      <p class="info">Você está conectado com o email <strong>{{ userEmail }}</strong>.</p>

      <div class="actions">
        <button @click="handleLogout">Sair</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const userName = ref("");
const userEmail = ref("");

onMounted(() => {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  if (!loggedUser) {
    router.push("/login");
  } else {
    userName.value = loggedUser.name;
    userEmail.value = loggedUser.email;
  }
});

const handleLogout = () => {
  localStorage.removeItem("loggedUser");
  router.push("/login");
};
</script>

<style scoped>
.dashboard-page {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  color: #fff;
  background-image: url("../assets/background_login.webp");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.dashboard-box {
  width: 100%;
  max-width: 500px;
  padding: 40px;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

h1 {
  margin-bottom: 15px;
  font-size: 2.2rem;
  font-weight: 400;
}

.info {
  margin-bottom: 30px;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.85);
}

.actions button {
  padding: 12px 20px;
  font-size: 1.1rem;
  font-weight: 500;
  color: #fff;
  background-color: #583c9e;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.actions button:hover {
  background-color: #493182;
}
</style>
