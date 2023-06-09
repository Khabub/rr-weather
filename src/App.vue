<template>
  <TheNavigation />
  <main class="container">
    <v-form class="form" @submit.prevent>
      <v-text-field
        class="search-city"
        label="Enter address"
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

    <transition name="citybtn">
      <div v-if="isCityListActive">
        <div v-if="places.length > 0" class="city-list">
          <h1 class="choose-address">Choose address:</h1>
          <ul v-for="(item, index) in places" :key="index">
            <CityButton
              :name="item.formatted_address"
              @click="cityButtonHandler(index)"
            />
          </ul>
        </div>
      </div>
    </transition>

    <div v-if="dbList.length" class="save-update">
      <v-btn
        class="updateTemps"
        @click="updateCityList"
        size="x-small"
        color="primary"
        >Update the temps</v-btn
      >
    </div>
    <transition-group tag="section" name="citytr">
      <section v-for="(city, index) in dbList" :key="index">
        <CityCard
          :city="city.formatted_address"
          :highestTemp="city.highest_temp"
          :lowestTemp="city.lowest_temp"
          :place_id="city.place_id"
          :rain="city.rain"
          :temp_now="city.temp_now"
          @deleteCity="deleteCity"
        />
      </section>
    </transition-group>

    <v-snackbar
      color="success"
      min-width="250"
      v-model="snackbar"
      :timeout="timeout"
    >
      <span class="snack">Temps updated!</span>
    </v-snackbar>
    <v-snackbar
      color="error"
      min-width="290"
      v-model="snackbarDelete"
      :timeout="timeout"
    >
      <span class="snack">{{ cityDeleted }} deleted!</span>
    </v-snackbar>
    <v-snackbar
      color="error"
      min-width="290"
      v-model="snackError"
      :timeout="timeout"
    >
      <span class="snack">Error: {{ error }}</span>
    </v-snackbar>
  </main>
</template>

<script setup lang="ts">
import axios from "axios";
import { useWeatherStore } from "./stores/weather";
import { storeToRefs } from "pinia";
import { onMounted, onUpdated, reactive, ref, type Ref } from "vue";
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
  rain: number;
  temp_now: number;
}

// variables
const store = useWeatherStore();
const { getCities } = store;
const { select, checkConfirm, places } = storeToRefs(store);
const dbList: DBListInterface[] = reactive([]);
const isCityListActive = ref(true);
const snackbar = ref(false);
const snackbarDelete = ref(false);
const timeout = ref(2000);
const hours = ref(new Date().getHours());
const cityDeleted = ref("");
const snackError = ref(false);
const error = ref("");

// actions
const submitHandler = () => {
  isCityListActive.value = true;
  getCities(select.value);
};

const timeoutFce = (val: Ref<boolean>) => {
  setTimeout(() => {
    val.value = false;
  }, 2000);
};

// after click, add the city to dbList
const cityButtonHandler = (index: number) => {
  isCityListActive.value = false; // hide the list
  select.value = ""; // clear the input
  const tmp = places.value[index];

  (async () => {
    try {
      const url = ref(
        `https://api.open-meteo.com/v1/forecast?latitude=${tmp.latitude}&longitude=${tmp.longitude}&daily=temperature_2m_max,temperature_2m_min,rain_sum&hourly=temperature_2m&current_weather=true&timezone=auto`
      );
      const response = await axios.get(url.value);

      //console.log(response);
      dbList.push({
        formatted_address: tmp.formatted_address,
        place_id: tmp.place_id,
        highest_temp: response.data.daily.temperature_2m_max[0],
        lowest_temp: response.data.daily.temperature_2m_min[0],
        latitude: tmp.latitude,
        longitude: tmp.longitude,
        rain: response.data.daily.rain_sum[0],
        temp_now: response.data.hourly.temperature_2m[hours.value],
      });
    } catch (err) {
      snackError.value = true;
      error.value = (err as Error).message;
      timeoutFce(snackError);
      console.error(err);
    }
  })();
};

// update temps
const updateCityList = async () => {
  // load data from localStorage
  const listTmp = window.localStorage.getItem("rrdbListCities") as string;
  if (listTmp) {
    const parsed = JSON.parse(listTmp);
    dbList.splice(0, parsed.length, ...parsed);
  }
  isCityListActive.value = false; // hide the list

  // create an array to hold all the API request promises
  const requestPromises: Promise<any>[] = [];

  // iterate over each city in dbList
  dbList.forEach((val: DBListInterface) => {
    // create a promise that gets the temperature data for this city
    const requestPromise = (async () => {
      try {
        const url = ref(
          `https://api.open-meteo.com/v1/forecast?latitude=${val.latitude}&longitude=${val.longitude}&daily=temperature_2m_max,temperature_2m_min,rain_sum&hourly=temperature_2m&current_weather=true&timezone=auto`
        );
        const response = await axios.get(url.value);
        //console.log(response);
        // set temps
        val.highest_temp = response.data.daily.temperature_2m_max[0];
        val.lowest_temp = response.data.daily.temperature_2m_min[0];
        val.rain = response.data.daily.rain_sum[0];
        val.temp_now = response.data.hourly.temperature_2m[hours.value];
      } catch (err) {
        snackError.value = true;
        error.value = (err as Error).message;
        timeoutFce(snackError);
        console.error(err);
      }
    })();

    // add the promise to the requestPromises array
    requestPromises.push(requestPromise);
  });

  // wait for all the promises to resolve before continuing
  await Promise.all(requestPromises);

  // snackbar notifications
  snackbar.value = true;
  timeoutFce(snackbar);
};

const deleteCity = (id: string, city: string) => {
  const updateList = dbList.filter((val) => val.place_id !== id);
  dbList.splice(0, dbList.length, ...updateList);
  snackbarDelete.value = true;
  cityDeleted.value = city;
  timeoutFce(snackbarDelete);
};

onMounted(() => {
  // load data from localStorage
  const listTmp = window.localStorage.getItem("rrdbListCities") as string;
  if (listTmp) {
    const parsed = JSON.parse(listTmp);
    dbList.splice(0, parsed.length, ...parsed);
  }
  isCityListActive.value = false; // hide the list
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

.snack {
  display: flex;
  justify-content: center;
}
.form {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 3rem;
  width: 90vw;
}

@media (min-width: 440px) {
  .form {
    width: 400px;
  }  
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
  margin-bottom: 1rem;
}
.save-update {
  width: 90vw;
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 0.5rem;
}
.choose-address {
  font-size: 0.7rem;
  margin-left: 0.1rem;
}
.updateTemps {
  display: flex;
  padding: 0.8rem;
  animation: getIn 1s cubic-bezier(0, 1, 1, 1.2);
}

@keyframes getIn {
  0% {
    transform: translateX(200%) rotate(0);
  }
  50% {
    transform: translateX(60%) rotate(10deg);
  }
  100% {
    transform: translateX(0) rotate(0);
  }
}

.citytr-enter-from {
  opacity: 0;
  transform: translateX(-300px);
}
.citytr-enter-active {
  transition: all 0.8s ease-in;
}
.citytr-enter-to {
  opacity: 1;
}
.citytr-leave-from {
  opacity: 1;
}
.citytr-leave-active {
  transition: all 0.8s ease-out;
  position: absolute;
}
.citytr-leave-to {
  opacity: 0;
  transform: translateX(300px);
}
.citytr-move {
  transition: all 0.7s ease;
}

.citybtn-enter-from {
  opacity: 0;
}
.citybtn-enter-active {
  transition: all 0.5s ease-in;
}
.citybtn-enter-to {
  opacity: 1;
}
.citybtn-leave-from {
  opacity: 1;
}
.citybtn-leave-active {
  transition: all 0.5s ease-out;
}
.citybtn-leave-to {
  opacity: 0;
}
</style>
