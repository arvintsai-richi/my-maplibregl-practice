<script setup>
import {} from 'vue';
import { forAdmin } from '@/api/server/demo';
import { useRequest } from '@/composables/useRequest';

const { isLoading, data, send, stop } = useRequest(forAdmin);
</script>

<template>
  <h2>test normal request</h2>
  <p>( 解構使用 composable function )</p>
  <button @click="send()">send</button>
  <button @click="stop()">abort</button>

  {{ isLoading ? 'loading' : data }}
</template>

<style lang="scss" scoped></style>
