<script setup lang="ts">
import DayStats from "@/components/viz/DayStats.vue";
import { totalsByDay } from "./../db/db.js";
import { DateTime } from "luxon";

console.log(totalsByDay);
console.log(DateTime.now().toString());
</script>

<template>
  <main>
    <div class="flex">
      <DayStats
        v-for="(d, i) in Object.keys(totalsByDay)"
        :key="i"
        :totals="totalsByDay[d]"
        :day="d"
      />
    </div>
  </main>
</template>
