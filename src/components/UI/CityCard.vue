<template>
  <slot>
    <main class="container">
      <div class="city-country">
        <p class="city-text">{{ props.city }}</p>        
      </div>
      <div class="teploty">
        <p>
          Highest: <span>{{ props.highestTemp }}°C</span>
        </p>
        <p>
          Lowest: <span>{{ props.lowestTemp }}°C</span>
        </p>
      </div>
      <SvgIcon class="cancel" type="mdi" :path="path"/>
    </main>
  </slot>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiClose } from '@mdi/js';

const path = mdiClose;

const props = defineProps({
  city: String as PropType<string>,
  country_code: String as PropType<string>,
  highestTemp: Number as PropType<number>,
  lowestTemp: Number as PropType<number>,
});
</script>

<style scoped>
.container {
  border-radius: 0.4rem;
  box-shadow: 5px 5px 5px #a09c88;
  width: 90vw;
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
  top: 10px;
  right: 1px;
  color: red;
  padding: 0.2rem;
}
</style>
