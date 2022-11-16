<script setup lang="ts">
const props = defineProps({
  totals: { type: Object, required: true },
  day: { type: String, required: true },
});

function asHour(minutes: number): string {
  let hours = Math.floor(minutes / 60);
  let minutes_remaining = minutes % 60;
  let pad = minutes_remaining < 10 ? "0" : "";
  return hours + ":" + pad + minutes_remaining;
}
</script>

<template>
  <div class="ml-10">
    <div>{{ props.day }}</div>
    <table>
      <tr v-for="(c, i) in Object.keys(totals)" :key="`${c} ${i}`">
        <td class="pr-5">{{ c }}</td>
        <td>{{ asHour(totals[c]) }}</td>
      </tr>
    </table>
  </div>
</template>

<style scoped></style>
