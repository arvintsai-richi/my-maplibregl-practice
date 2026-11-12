<script setup>
defineProps({
  username: String,
});
</script>

<template>
  <div class="demo">
    <router-link
      :to="{
        name: 'Examples-DynamicRoute-:username-Posts-Home',
        params: { username },
      }"
    >
      posts home
    </router-link>
    <router-link
      :to="{
        name: 'Examples-DynamicRoute-:username-Posts-:postId',
        params: { username, postId: 1 },
      }"
    >
      postId: 1
    </router-link>
    <router-link
      :to="{
        name: 'Examples-DynamicRoute-:username-Posts-:postId',
        params: { username, postId: 2 },
      }"
    >
      postId: 2
    </router-link>
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
