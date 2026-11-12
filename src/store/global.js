import { defineStore } from 'pinia';
import { ref } from 'vue';
import http from '@/api/server';
import * as Auth from '@/api/server/auth.js';

export const useGlobalStore = defineStore('global', () => {
  const isLogin = ref(false);
  const userInfo = ref(null);

  async function login() {
    let result = await Auth.login.send({ role: 'SuperAdmin' });
    console.log('init JWT');
    http.jwt.initToken(result);
    await fetchUserInfo();
  }

  async function fetchUserInfo() {
    userInfo.value = {
      role: 'SuperAdmin',
    };
    isLogin.value = true;
  }

  async function logout() {
    http.jwt.clearToken();
    isLogin.value = false;
  }

  return {
    login,
    logout,
    fetchUserInfo,
    userInfo,
    isLogin,
  };
});
