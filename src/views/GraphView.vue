<script setup lang="ts">
import { ref } from "vue";
import { onBeforeMount } from "vue";

import { allEntries } from "../db/db.js";
import { DateTime } from "luxon";

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
      entries.push(
        res
          .filter((e: any) => e.day == day)
          .map((e: any) => {
            return {
              category: e.category,
              description: e.description,
              duration: e.duration,
              absoluteStart: e.absoluteStart,
            };
          })
      );
    });
    //console.log(entries);
    raw.value = entries;
    entriesByDay.value = entries;
  });
});
</script>

<template>
  <main>
    <div class="flex flex-col ml-6">
      <div
        v-for="(day, i) in entriesByDay.reverse()"
        :key="i"
        class="flex no-wrap mt-10"
      >
        <div
          v-for="(entry, j) in day"
          :key="j"
          class="bg-slate-900 h-10 border-r w-5"
          :style="{ width: `${entry.duration}px` }"
        ></div>
      </div>
    </div>
  </main>
</template>
