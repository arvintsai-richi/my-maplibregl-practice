<script setup>
import {} from 'vue';
import CachedRouterView from '@/components/CachedRouterView.vue';
</script>

<template>
  <div>
    <h2>Cached Router View</h2>
    <ul>
      <li>
        ---<router-link to="/Examples/CachedRouterView">home</router-link>
      </li>
      |
      <li>
        ---<router-link to="/Examples/CachedRouterView/countA"
          >countA</router-link
        >
      </li>
      |
      <li>
        ---<router-link to="/Examples/CachedRouterView/countB"
          >countB</router-link
        >
      </li>
      \
      <li>
        　------<router-link to="/Examples/CachedRouterView/countB/countB1"
          >countB-1</router-link
        >
      </li>
      \
      <li>
        　------<router-link to="/Examples/CachedRouterView/countB/countB2"
          >countB-2</router-link
        >
      </li>
      \
      <li>
        　------<router-link to="/Examples/CachedRouterView/countB/countB3"
          >countB-3</router-link
        >
      </li>
    </ul>

    <div class="child">
      <h2>
        <pre>{{ "<RouterView />" }}</pre>
      </h2>
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style lang="scss" scoped>
ul {
  margin: 1rem;
}

.child {
  margin: 5rem;
  padding: 2rem;
  border: 1px black solid;
}
</style>
