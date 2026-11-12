<script setup></script>

<template>
  <div class="demo" style="">
    <h2>file-system routing demo</h2>
    <router-link to="/Examples/NestedRoutes">default child</router-link>
    <router-link to="/Examples/NestedRoutes/Child1"
      >child 1 (by route path)</router-link
    >
    <router-link :to="{ name: 'Examples-NestedRoutes-Child2' }"
      >child 2 (by route name)</router-link
    >
    <router-view />
  </div>
</template>

<style lang="scss">
.demo {
  display: flex;
  flex-direction: column;
  border: 3px gray solid;
  padding: 1rem;

  &:hover {
    border-color: red;
  }

  div {
    height: 250px;
    border: 3px gray solid;
    padding: 1rem;

    &:hover {
      border-color: red;
    }
  }
}
</style>
