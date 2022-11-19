<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <div class="wrapper">
      <nav class="flex justify-center gap-x-5 m-3">
        <RouterLink to="/">Tabla</RouterLink>
        <RouterLink to="/about">Grafico</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped></style>
