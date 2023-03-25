<template>
  <TheNavigation />
  <main class="container">
    <v-form class="form" @submit.prevent>
      <v-text-field
        class="search-city"
        label="Enter city"
        density="compact"
        variant="outlined"
        v-model="select"
        v-on:keyup.enter="submitHandler"
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

    <div v-if="isCityListActive">
      <div v-if="places.length > 0" class="city-list">
        <h1>Choose city:</h1>
        <ul v-for="(item, index) in places" :key="index">
          <CityButton
            :name="item.formatted_address"
            @click="cityButtonHandler(index)"
          />
        </ul>
      </div>
    </div>
    <div class="save-update">
      <v-btn @click="updateCityList" size="x-small" color="primary"
        >Update the temps</v-btn
      >
    </div>
    <section v-for="(city, index) in dbList" :key="index">
      <CityCard
        :city="city.formatted_address"
        :highestTemp="city.highest_temp"
        :lowestTemp="city.lowest_temp"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import axios from "axios";
import { useWeatherStore } from "./stores/weather";
import { storeToRefs } from "pinia";
import { onBeforeMount, onMounted, onUpdated, reactive, ref } from "vue";
import CityButton from "@/components/UI/CityButton.vue";
import CityCard from "./components/UI/CityCard.vue";
import TheNavigation from "./components/TheNavigation.vue";

interface DBListInterface {
  formatted_address: string;
  place_id: string;
  highest_temp: number;
  lowest_temp: number;
  latitude: number;
  longitude: number;
}

// variables
const store = useWeatherStore();
const { getCities } = store;
const { select, checkConfirm, places } = storeToRefs(store);
const dbList: DBListInterface[] = reactive([]);
const isCityListActive = ref(true);

// actions
const submitHandler = () => {
  isCityListActive.value = true;
  getCities(select.value);
};

// after click, add the city to dbList
const cityButtonHandler = (index: number) => {
  isCityListActive.value = false; // hide the list
  select.value = ""; // clear the input
  const tmp = places.value[index];

  (async () => {
    const url = ref(
      `https://api.open-meteo.com/v1/forecast?latitude=${tmp.latitude}&longitude=${tmp.longitude}&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=Europe%2FMoscow`
    );
    const response = await axios.get(url.value);

    dbList.push({
      formatted_address: tmp.formatted_address,
      place_id: tmp.place_id,
      highest_temp: response.data.daily.temperature_2m_max[0],
      lowest_temp: response.data.daily.temperature_2m_min[0],
      latitude: tmp.latitude,
      longitude: tmp.longitude,
    });
  })();
};

/* onMounted(() => {
  // load data from localStorage
  const listTmp = window.localStorage.getItem("rrdbListCities") as string;
  if (listTmp) {
    const parsed = JSON.parse(listTmp);
    dbList.splice(0, parsed.length, ...parsed);
  }
  isCityListActive.value = false;   // hide the list

  dbList.forEach((val: DBListInterface) => {
    getCities(val.formatted_address);    // get data from web

    console.log("places:", places.value[0].place_id);
    console.log("dbList", dbList[0].place_id);

    // find the same city from localStorage
    const labelIndex = places.value.findIndex(
      (item) => item.place_id === val.place_id
    );
    console.log("labelIndex:", labelIndex);

    if (labelIndex >= 0) {
      const tmp = places.value[labelIndex];

      // get temps
      (async () => {
        const url = ref(
          `https://api.open-meteo.com/v1/forecast?latitude=${tmp.latitude}&longitude=${tmp.longitude}&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=Europe%2FMoscow`
        );
        const response = await axios.get(url.value);

       console.log(response.status);
        // set temps
        val.highest_temp = response.data.daily.temperature_2m_max[0];
        val.lowest_temp = response.data.daily.temperature_2m_min[0];
      })();
    }
  });
}); */

const updateCityList = () => {
  // load data from localStorage
  const listTmp = window.localStorage.getItem("rrdbListCities") as string;
  if (listTmp) {
    const parsed = JSON.parse(listTmp);
    dbList.splice(0, parsed.length, ...parsed);
  }
  isCityListActive.value = false; // hide the list

  dbList.forEach((val: DBListInterface) => {
    setTimeout(() => {
      getCities(val.formatted_address); // get data from web
    }, 1500);
      
      console.log("heeerreee");
      
    // find the same city from localStorage
    const labelIndex = places.value.findIndex(
      (item) => item.formatted_address === val.formatted_address
    );
    console.log("labelIndex:", labelIndex);

    if (labelIndex >= 0) {
      const tmp = places.value[labelIndex];
      
      // get temps
      (async () => {
        const url = ref(
          `https://api.open-meteo.com/v1/forecast?latitude=${tmp.latitude}&longitude=${tmp.longitude}&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=Europe%2FMoscow`
          );
          const response = await axios.get(url.value);

          console.log(response.status);
          // set temps
          val.highest_temp = response.data.daily.temperature_2m_max[0];
          val.lowest_temp = response.data.daily.temperature_2m_min[0];
      })();
    }
  });
};

onMounted(() => {
  // load data from localStorage
  const listTmp = window.localStorage.getItem("rrdbListCities") as string;
  if (listTmp) {
    const parsed = JSON.parse(listTmp);
    dbList.splice(0, parsed.length, ...parsed);
  }
  isCityListActive.value = false; // hide the
});

onUpdated(() => {
  window.localStorage.setItem("rrdbListCities", JSON.stringify(dbList));
});

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
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.form {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2.5rem;
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
.cityCardSection {
  display: flex;
}
.save-update {
  width: 90vw;
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 0.5rem;
}
</style>
