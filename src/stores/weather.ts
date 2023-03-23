import { defineStore } from "pinia";
import axios from "axios";
import { reactive, ref, computed } from "vue";

export type PlacesTypes = {
  label: string;
};

export const useWeatherStore = defineStore("weather", () => {
  // variables
  const apiKey = import.meta.env.VITE_API_KEY;
  const select = ref("");
  const places: string[] = reactive([]);

  // computed
  const checkConfirm = computed(
    () =>
      (select.value.length > 0 && places.length > 0) || select.value.length == 0
  );

  // actions
  const getCities = async () => {
    // create base URL
    const http = axios.create({
      baseURL: "http://api.positionstack.com",
    });
  
    const url_name = ref(
      `/v1/forward?access_key=${apiKey}&query=${select.value}`
    );
    const response_name = await http.get(url_name.value);
    console.log(response_name.data);
    const temp = response_name.data;
  
    temp.data.forEach((obj: PlacesTypes) => {
      places.push(obj.label);
    });
  
    // remove duplicates
    const tmp = [...new Set(places)];
    places.splice(0, places.length, ...tmp);
  };

  return {
    getCities,
    select,
    checkConfirm,
    places
  }
})