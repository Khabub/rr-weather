<template>
  <slot>
    <v-layout>
      <main class="container">
        <p class="logo">rr-weather</p>
        <SvgIcon
          class="svg-icon"
          type="mdi"
          :path="path"
          @click="drawerHandler"
        ></SvgIcon>
      </main>
      <v-navigation-drawer
        v-model="drawer"
        location="bottom"
        width="55"
        temporary
      >
        <div class="footer">
          <p class="created">Created by Robert Rozehnal, 2023</p>
          <SvgIcon
            class="svg-icon"
            type="mdi"
            :path="pathFB"
            @click="
              () => openInNewTab('https://www.facebook.com/robert.rozehnal.7')
            "
          ></SvgIcon>
          <SvgIcon
            class="svg-icon"
            type="mdi"
            :path="pathGithub"
            @click="() => openInNewTab('https://github.com/Khabub')"
          ></SvgIcon>
        </div>
      </v-navigation-drawer>
    </v-layout>
  </slot>
</template>

<script setup lang="ts">
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiMenu } from "@mdi/js";
import { mdiFacebook } from "@mdi/js";
import { mdiGithub } from "@mdi/js";
import { ref } from "vue";
import { openInNewTab } from "@/components/helpers/openNewTab";

const path = mdiMenu;
const pathFB = mdiFacebook;
const pathGithub = mdiGithub;
const drawer = ref(false);

const drawerHandler = () => {
  drawer.value = !drawer.value;
};

defineExpose({
  drawer,
  drawerHandler,
});
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

.footer {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 0.4rem;
}

@media (min-width: 440px) {
  .container {
    justify-content: space-between;
  }
  .svg-icon {
    margin-right: 1.5rem;
  }

  .svg-icon:hover {
    cursor: pointer;
  }
  .logo {
    margin-left: 1rem;
  }
  .footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.4rem;
  }
}
</style>
