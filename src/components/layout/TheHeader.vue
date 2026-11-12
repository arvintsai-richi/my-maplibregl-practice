<script setup>
import { useGlobalStore } from '@/store/global';

const store = useGlobalStore();
</script>

<template>
  <header class="header">
    <h1 class="header-title">
      <router-link class="nav-link" to="/">Demo App</router-link>
    </h1>
    <nav class="header-nav">
      <ul class="nav-list">
        <li class="nav-item">
          <router-link class="nav-link" to="/Examples">Examples</router-link>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            href="http://192.168.0.143:8080/tfs/ModuleCollection/MapLibreGLPractice"
            target="_blank"
            >Source Code ↗</a
          >
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            href="https://docs.google.com/document/d/1OzFlwzkiG1HnHfcVaXfDcuLXeyPanmcBFvRaP8_oTGQ/edit?pli=1#heading=h.rgldhmi3lxgu"
            target="_blank"
            >Document ↗</a
          >
        </li>
      </ul>
    </nav>
    <div v-if="store.isLogin">
      Hi {{ store.userInfo.role }}
      <button class="login-button" v-on:click="store.logout()">Logout</button>
    </div>
    <div v-else>
      <!-- <router-link class="login-button" to="/Login">to Login</router-link> -->
      <button class="login-button" v-on:click="store.login()">Login</button>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 1rem 2rem;
  background-color: #282c34;
  color: white;
}

.header-title {
  font-size: 2rem;
}

.header-nav {
  flex-grow: 1;
}

.nav-list {
  display: flex;
  gap: 1rem;
}

.nav-item {
  margin: 0 1rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #61dafb;
}

.login-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  background-color: #61dafb;
  color: #282c34;
  cursor: pointer;
  transition: background-color 0.3s;
  text-decoration: none;
}

.login-button:hover {
  background-color: #21a1f1;
}
</style>
