<script setup>
import { reactive } from 'vue';
import { sayHi } from '@/api/server/demo';
import { useRequest } from '@/composables/useRequest';

// 不解構使用 composable function 時，用 reactive() 包裝物件，可避免 ref().value unwrap 問題
const restfulRequest = reactive(useRequest(sayHi));
</script>

<template>
  <h2>test restful request</h2>
  <p>
    ( 不解構使用 composable function 時，用 reactive() 包裝物件，可避免
    ref().value unwrap 問題 )
  </p>
  <button @click="restfulRequest.send({ firstName: 'john', lastName: 'doe' })">
    send
  </button>
  <button @click="restfulRequest.stop()">abort</button>

  {{ restfulRequest.isLoading ? 'loading' : restfulRequest.data }}
</template>

<style lang="scss" scoped></style>
