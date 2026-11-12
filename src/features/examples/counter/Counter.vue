<script setup>
import { useCounter } from './useCounter.js';

const { count, increment, decrement, reset, setCount } = useCounter(0);
</script>

<template>
  <div>
    <h2>計數器: {{ count }}</h2>
    <button @click="increment()">增加</button>
    <button @click="decrement()">減少</button>
    <button @click="reset()">重設</button>
    <button @click="setCount(10)">設置為 10</button>
  </div>
</template>
