<script setup lang="ts">
import { ref } from "vue";
import { onBeforeMount } from "vue";
import ShowCard from "@/components/viz/ShowCard.vue";
import { allEntries } from "@/db/db";

import { DateTime } from "luxon";

console.log(DateTime.now().toString());

const entries: any = ref({});
onBeforeMount(() => {
  allEntries.then((res) => (entries.value = res.reverse()));
});
</script>

<template>
  <main>
    <div class="flex gap-3 px-10">
      <ShowCard v-for="(entry, i) in entries" :card="entry" :key="i" />
    </div>
  </main>
</template>
