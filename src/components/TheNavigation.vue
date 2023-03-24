<template>
  <slot>
  <main class="container">
    <p class="logo">rr-weather</p>    
    <SvgIcon type="mdi" :path="path"></SvgIcon>
  </main>
  </slot>
</template>

<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiMenu } from '@mdi/js';

const path = mdiMenu;

</script>


<style scoped>
.container {
  position: fixed;
  background-color: #9ef4ff;
  width: 100vw;  
  z-index: 900;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0.2rem;
}

.logo {
  padding-left: 1rem;
  margin-right: auto;
}
</style>
