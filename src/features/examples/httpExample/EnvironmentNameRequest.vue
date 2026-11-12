<script setup>
import { ref } from 'vue';
import { getEnvironmentName } from '@/api/server/demo';
import { useRequest } from '@/composables/useRequest';

const data = ref(null);
const isLoading = ref(false);
const send = async () => {
  try {
    isLoading.value = true; // 開始 loading
    const response = await getEnvironmentName.send(); // 發送請求
    data.value = response; // 更新文字
  } catch (error) {
    alert(error); // 錯誤處理
  } finally {
    isLoading.value = false; // 結束 loading
  }
};
</script>

<template>
  <h2>get environmentName request</h2>
  <p>( 不使用 useRequest() )</p>
  <button @click="send()">send</button>
  <button @click="getEnvironmentName.abort()">abort</button>

  {{ isLoading ? 'loading' : data }}
</template>

<style lang="scss" scoped></style>
