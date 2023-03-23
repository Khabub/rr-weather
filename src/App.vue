<template>
  <main>
    <v-form class="form" submit.prevent>
      <v-text-field
        class="search-city"
        label="Enter city"
        density="compact"
        variant="outlined"
        v-model="select"
        @focus="
          select = '';
          places.length = 0;
        "
      ></v-text-field>
      <v-btn
        class="submit"
        :disabled="checkConfirm"
        size="small"
        color="success"
        @click="submitHandler"
        >Confirm</v-btn
      >
    </v-form>
    <div v-if="places.length > 0" class="city-list">
      <h1>Choose city:</h1>  
      <ul v-for="place, index in places" :key="index">
        <CityButton :place="place" @click="cityButtonHandler(index)"/>
      </ul>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useWeatherStore } from "./stores/weather";
import { storeToRefs } from "pinia";
import CityButton from "@/components/UI/CityButton.vue";

const store = useWeatherStore();
const { getCities } = store;
const { select, checkConfirm, places } = storeToRefs(store);

const submitHandler = () => {
  getCities();
};

const cityButtonHandler = (index: number) => {
  console.log(places.value[index])
}

/* const loadAPI = async () => {
  const urlW = ref(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat.value}&longitude=${long.value}&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=Europe%2FMoscow`
  );
  const response = await axios.get(urlW.value);
  console.log(response.data);

  //day.value = response.data.current_weather.temperature;
 // nejvyssi.value = response.data.daily.temperature_2m_max[1];
}; */

/* watch(
  () => search.value,
  (newValue) => {    
    newValue && newValue !== select.value && querySelections(newValue);
  }
);

const querySelections = (v: string) => {
  loading.value = true;
  setTimeout(() => {
    v.length > 2 && getIstanbul(v);
    loading.value = false;    
  }, 500);
}; */

// aktuálně
/* const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        latitude.value = position.coords.latitude;
        longitude.value = position.coords.longitude;
      },
      (error) => {
        console.error(`Error getting geolocation: ${error.message}`);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}; */

/* const url = ref(
  "https://api.open-meteo.com/v1/forecast?latitude=49.24&longitude=16.57&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&timezone=Europe%2FLondon"
); */
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.form {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  width: 90vw;
}

.submit {
  margin: 0 0 1.5rem 0.5rem;
}

ul {
  list-style-type: none;
}
h1 {
  font-size: 1rem;
}
.city-list {
  display: flex;
  flex-direction: column;
  width: 90vw;
}
</style>
