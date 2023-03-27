<template>
  <slot></slot>
  <main class="container">
    <div class="city-country">
      <p class="city-text">{{ props.city }}</p>
    </div>
    <div class="teploty">
      <p>Now: {{ props.temp_now }}°C</p>
      <p>High: {{ props.highestTemp }}°C</p>
      <p>Low: {{ props.lowestTemp }}°C</p>
      <p>Rain: {{ props.rain }}mm</p>
    </div>
    <SvgIcon
      class="cancel"
      @click="
        emit('deleteCity', props.place_id as string, props.city as string)
      "
      type="mdi"
      :path="path"
    />
  </main>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiClose } from "@mdi/js";

const path = mdiClose;

const props = defineProps({
  city: String as PropType<string>,
  highestTemp: Number as PropType<number>,
  lowestTemp: Number as PropType<number>,
  place_id: String as PropType<string>,
  rain: Number as PropType<number>,
  temp_now: Number as PropType<number>,
});

const emit = defineEmits<{
  (event: "deleteCity", id: string, city: string): void;
}>();
</script>

<style scoped>
.container {
  border-radius: 0.4rem;
  box-shadow: 5px 5px 5px #a09c88;
  width: 90vw;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #e4dba9;
  margin-top: 1rem;
  position: relative;
  padding: 0.3rem 0;
}

.teploty {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  font-size: 0.7rem;
  padding: 0.2rem 0;
}
.city-country {
  display: flex;
  justify-content: center;
  align-items: center;
}

.city-text {
  font-size: 0.8rem;
  font-weight: 700;
}

.cancel {
  position: absolute;
  top: 0;
  right: 1px;
  color: red;
  padding: 0.2rem;
}
</style>
