<script setup lang="ts">
import { ref } from 'vue';
import Google from '@/assets/images/auth/social-google.svg';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const isLoading = ref(false);

const handleGoogleLogin = () => {
  isLoading.value = true;
  // Ini adalah simulasi login Google.
  // Untuk production, Anda bisa menggunakan Supabase/Firebase/NextAuth dll.
  setTimeout(() => {
    authStore.login('info@codedthemes.com', 'admin123').finally(() => {
      isLoading.value = false;
    });
  }, 1000);
};
</script>

<template>
  <v-btn 
    block 
    color="primary" 
    variant="outlined" 
    class="text-lightText googleBtn" 
    @click="handleGoogleLogin"
    :loading="isLoading"
  >
    <img :src="Google" alt="google" />
    <span class="ml-2">Sign in with Google</span>
  </v-btn>
</template>

<style lang="scss">
.googleBtn {
  border-color: rgba(0, 0, 0, 0.08);
  margin: 30px 0 20px 0;
}
</style>
