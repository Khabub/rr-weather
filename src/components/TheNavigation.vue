<template>
  <slot>
    <v-layout>
      <main class="container">
        <p class="logo">rr-weather</p>
        <SvgIcon type="mdi" :path="path" @click="drawerHandler"></SvgIcon>
      </main>
      <v-navigation-drawer
        v-model="drawer"
        location="bottom"
        width="40"
        temporary
      >
        <p class="created">Created by Robert Rozehnal, 2023</p>
      </v-navigation-drawer>
    </v-layout>
  </slot>
</template>

<script setup lang="ts">
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiMenu } from "@mdi/js";
import { ref } from "vue";

const path = mdiMenu;
const drawer = ref(false);

const drawerHandler = () => {
  drawer.value = !drawer.value;
};
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
  padding: 0.3rem;
}
.logo {
  padding-left: 1rem;
  margin-right: auto;
}
.created {
  font-size: 0.8rem;
  text-align: center;
  padding: 0.6rem;
}
</style>
