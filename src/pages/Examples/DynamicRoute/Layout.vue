<script setup></script>

<template>
  <div class="demo">
    <router-link
      :to="{
        name: 'Examples-DynamicRoute-:username',
        params: { username: 'john' },
      }"
      >username: 'john'</router-link
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
