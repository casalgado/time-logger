<script setup lang="ts">
import { ref } from "vue";
import { onBeforeMount } from "vue";

import { allEntries } from "../db/db.js";
import { DateTime } from "luxon";
import DayBar from "@/components/viz/DayBar.vue";

const entriesByDay: any = ref([]);
const raw: any = ref([]);
onBeforeMount(() => {
  allEntries.then((res) => {
    let days: any = [];
    res.forEach((e: any) => {
      if (!days.includes(e.day)) {
        days.push(e.day);
      }
    });
    let entries: any = [];
    //console.log(days);
    days.forEach((day: any) => {
      entries.push(res.filter((e: any) => e.day == day));
    });
    raw.value = entries;
    entriesByDay.value = entries.reverse();
  });
});
</script>

<template>
  <main>
    <div class="flex flex-col ml-6">
      <div v-for="(day, i) in entriesByDay" :key="i">
        <div class="flex no-wrap mt-10">
          <DayBar :day="day" />
        </div>
      </div>
    </div>
  </main>
</template>
