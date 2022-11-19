<script setup lang="ts">
import { ref } from "vue";
import { onBeforeMount } from "vue";
import DayStats from "@/components/viz/DayStats.vue";
import { totalsByDay } from "../db/db.js";
import { DateTime } from "luxon";

console.log(DateTime.now().toString());

const allTotals: any = ref({});
onBeforeMount(() => {
  totalsByDay.then((res) => (allTotals.value = res));
});
</script>

<template>
  <main>
    <div class="flex">
      <DayStats
        v-for="(d, i) in Object.keys(allTotals)"
        :key="i"
        :totals="allTotals[d]"
        :day="d"
      />
    </div>
  </main>
</template>
