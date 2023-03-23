<template>
  <li> 
    <v-btn class="button-city" variant="tonal" density="compact">
      {{props.place}}
    </v-btn>         
       
  </li>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

const props = defineProps({
  place: String as PropType<string>
})

</script>

<style scoped>

.button-city {
  width: 90vw;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 0.5rem;
}
</style>