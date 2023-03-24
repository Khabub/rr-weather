<template>
  <li>
    <v-btn class="button-city" variant="tonal" density="compact">
      {{ props.name }} ({{ props.country_code }})
    </v-btn>
  </li>
</template>

<script setup lang="ts">
import type { PropType } from "vue";

const props = defineProps({
  name: String as PropType<string>,
  country_code: String as PropType<string>,
});
</script>

<style scoped>
.button-city {
  font-size: 0.6rem;
  width: 95vw;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 0.5rem;
}
</style>
