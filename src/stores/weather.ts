import { defineStore } from "pinia";
import axios from "axios";
import { reactive, ref, computed } from "vue";

interface PlacesInterface {
  name: string;
  country_code: string;
  label: string;
  latitude: number;
  longitude: number;
}

export const useWeatherStore = defineStore("weather", () => {
  // variables
  const apiKey = import.meta.env.VITE_API_KEY;
  const select = ref("");
  const places: PlacesInterface[] = reactive([]);

  // computed
  // control Confirm button - disabled - true/false
  const checkConfirm = computed(
    () =>
      (select.value.length > 0 && places.length > 0) || select.value.length == 0
  );

  // actions
  const getCities = async (n: string) => {
    // create base URL
    const http = axios.create({
      baseURL: "http://api.positionstack.com",
    });

    // find place with name
    const url_name = ref(`/v1/forward?access_key=${apiKey}&query=${n}`);
    const response_name = await http.get(url_name.value);

    const temp = response_name.data;

    temp.data.forEach((obj: PlacesInterface) => {
      places.push({
        name: obj.name,
        country_code: obj.country_code,
        label: obj.label,
        latitude: obj.latitude,
        longitude: obj.longitude,
      });
    });

    // remove duplicates
    for (let i = 0; i < places.length; i++) {
      const place = places[i];
      if (i !== places.findIndex((p) => p.label === place.label)) {
        places.splice(i, 1);
        i--;
      }
    }
  };

  return {
    getCities,
    select,
    checkConfirm,
    places,
  };
});
