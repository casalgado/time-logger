<script setup lang="ts">
import { categories } from "@/db/db.js";
const props = defineProps({
  day: { type: Array as any, required: true },
});

function getColor(category: string): string | undefined {
  return categories.find((e: any) => e.name == category)?.color;
}
</script>

<template>
  <div
    v-for="(e, j) in props.day"
    :key="j"
    class="bg-slate-500 h-10 w-5"
    :class="getColor(e.category)"
    :style="{ width: `${e.duration}px` }"
  ></div>
</template>

<style scoped></style>
