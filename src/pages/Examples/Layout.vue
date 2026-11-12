<script setup>
import { useGlobalStore } from '@/store/global';
const store = useGlobalStore();
</script>

<template>
  <div class="examples">
    <aside class="sidebar">
      <nav>
        <ul class="nav-list">
          <li class="nav-item">
            <router-link class="nav-link" to="/Examples/NestedRoutes"
              >巢狀路由</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/Examples/CachedRouterView"
              >可快取路由</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/Examples/DynamicRoute"
              >動態路由</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/Examples/HttpService"
              >http 範例</router-link
            >
          </li>
        </ul>
      </nav>
    </aside>
    <RouterView class="main-content" />
  </div>
</template>

<style lang="scss" scoped>
.examples {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  max-width: 10rem;
  background-color: #f4f4f4;
  padding: 1rem;
  border-right: 1px solid #ccc;
}

.nav-list {
  list-style: none;
  padding: 0;
}

.nav-item {
  margin-bottom: 1rem;
}

.nav-link {
  text-decoration: none;
  color: #333;
  transition: color 0.3s;

  &:hover {
    color: #007bff; // 可以根據需要修改顏色
  }
}

.main-content {
  flex-grow: 1;
  padding: 1rem;
  background-color: #fff; // 主內容區域的背景顏色
}
</style>
