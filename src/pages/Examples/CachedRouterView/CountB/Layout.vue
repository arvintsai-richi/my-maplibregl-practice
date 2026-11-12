<script setup>
import { CounterWidget } from '@/features/examples/counter';
import CachedRouterView from '@/components/CachedRouterView.vue';
</script>

<template>
  <h3>name: countB</h3>
  <CounterWidget></CounterWidget>
  <div class="child">
    <h2>
      <pre>{{ "<CachedRouterView />" }}</pre>
    </h2>
    <CachedRouterView />
  </div>
</template>

<style lang="scss" scoped>
.child {
  margin: 5rem;
  padding: 2rem;
  border: 1px black solid;
}
</style>
