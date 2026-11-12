<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '@/store/global';

const router = useRouter();
const store = useGlobalStore();

const username = ref('');
const password = ref('');
const errorMessage = ref('');

const handleLogin = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = 'Username and password are required.';
    return;
  }

  await store.login();

  await router.push({ name: 'Home' });
};
</script>

<template>
  <div class="login-form">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          v-model="username"
          placeholder="Enter your username"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Enter your password"
          required
        />
      </div>

      <button type="submit">Login</button>
    </form>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.login-form {
  width: 300px;
  margin: 0 auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 0.5rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #36a373;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
