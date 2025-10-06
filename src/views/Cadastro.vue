<template>
  <div class="login-page">
    <div class="form-box">
      <h1>Cadastro</h1>
      <form @submit.prevent="handleRegister">
        <div class="input-group">
          <label for="name">Nome completo</label>
          <input type="text" id="name" v-model="name" required />
        </div>

        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required />
        </div>

        <div class="input-group">
          <label for="password">Senha</label>
          <input type="password" id="password" v-model="password" required />
        </div>

        <div class="input-group">
          <label for="confirmPassword">Confirmar senha</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            required
          />
        </div>

        <button type="submit">Cadastrar</button>
      </form>

      <div class="switch-form">
        <p>
          Já tem conta?
          <router-link to="/login">Entrar</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const router = useRouter();

const handleRegister = () => {
  if (password.value !== confirmPassword.value) {
    alert("As senhas não coincidem!");
    return;
  }

  console.log("Novo cadastro:", {
    name: name.value,
    email: email.value,
    password: password.value,
  });

  alert("Cadastro realizado com sucesso!");
  router.push("/login");
};
</script>

<style scoped>
.login-page {
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

.form-box {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  text-align: center;

  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);

  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

h1 {
  margin-bottom: 25px;
  font-size: 2.5rem;
  font-weight: 300;
  color: #fff;
}

.input-group {
  position: relative;
  margin-bottom: 30px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.8);
}

input {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  color: #fff;

  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;

  outline: none;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #7b4dff;
}

button {
  width: 100%;
  padding: 15px;
  font-size: 1.1rem;
  font-weight: 500;
  color: #fff;

  background-color: #583c9e;
  border: none;
  border-radius: 8px;

  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #493182;
}

.switch-form {
  margin-top: 20px;
}

.switch-form p {
  color: rgba(255, 255, 255, 0.8);
}

.switch-form a {
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  transition: color 0.3s;
}

.switch-form a:hover {
  color: #b39aff;
}
</style>
