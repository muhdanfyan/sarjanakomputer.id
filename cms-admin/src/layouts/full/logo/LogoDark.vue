<template>
  <div class="logo">
    <RouterLink to="/">
      <img :src="'/images/logo.png'" alt="Sarjana Komputer Indonesia" style="height: 45px; max-width: 100%; object-fit: contain;" />
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>
