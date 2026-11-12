<script setup>
import {} from 'vue';
import { getError } from '@/api/server/demo';
import { useRequest } from '@/composables/useRequest';

const errorRequest = useRequest(getError);
errorRequest.onError((error) => alert(error));
</script>

<template>
  <h2>test error request</h2>
  <p>( 不解構使用 composable function，但須注意 ref().value unwrap 問題 )</p>
  <p>
    <a
      href="https://vuejs.org/guide/essentials/reactivity-fundamentals.html#additional-ref-unwrapping-details"
      target="_blank"
    >
      vue3 官方 unwrap 機制說明
    </a>
  </p>
  <button @click="errorRequest.send({ firstName: 'john', lastName: 'doe' })">
    send
  </button>
  <button @click="errorRequest.stop()">abort</button>

  {{ errorRequest.isLoading.value ? 'loading' : errorRequest.data.value }}
</template>

<style lang="scss" scoped></style>
