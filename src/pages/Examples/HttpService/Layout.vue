<script setup>
import {} from 'vue';
import { useGlobalStore } from '@/store/global';
import {
  NormalRequest,
  ErrorRequest,
  RestfulRequest,
  EnvironmentNameRequest,
} from '@/features/examples/httpExample';

const store = useGlobalStore();
</script>

<template>
  <div v-if="!store.isLogin">please login to continue</div>
  <div v-else>
    <NormalRequest></NormalRequest>
    <hr />
    <ErrorRequest></ErrorRequest>
    <hr />
    <RestfulRequest></RestfulRequest>
    <hr />
    <EnvironmentNameRequest></EnvironmentNameRequest>
  </div>
</template>

<style lang="scss" scoped>
div {
  margin-bottom: 20px;
}

h2 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #38a773;
  }

  &:not(:last-child) {
    margin-right: 10px;
  }

  &:disabled {
    background-color: #d3d3d3;
    cursor: not-allowed;
  }
}

hr {
  border: none;
  border-top: 1px solid #ccc;
  margin: 20px 0;
}

/* 狀態樣式 */
.status {
  font-size: 1rem;
  margin-top: 10px;
  color: #2c3e50;

  &.loading {
    color: #f39c12;
  }

  &.finished {
    color: #27ae60;
  }
}
</style>
