import { defineStore } from "pinia";
import axios from "axios";
import { reactive, ref, computed } from "vue";

interface PlacesInterface {
  formatted_address: string;
  place_id: string;
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
      baseURL: "https://maps.googleapis.com",
    });

    // find place with name
    const url_name = ref(`/maps/api/geocode/json?address=${n}&key=${apiKey}`);
    const response_name = await http.get(url_name.value);
    const temp = response_name.data.results;

    //console.log(temp);
    
    if (response_name.status === 200) {
      console.log("Fetched data from google (rr)");
    } else {
      console.error("Could not fetch the data! (rr)");
    }

    temp.forEach((obj: any) => {
      places.push({
        formatted_address: obj.formatted_address,
        place_id: obj.place_id,
        latitude: obj.geometry.location.lat,
        longitude: obj.geometry.location.lng,
      });
    });

    // remove duplicates
    /* for (let i = 0; i < places.length; i++) {
      const place = places[i];
      if (
        i !==
        places.findIndex((p) => p.formatted_address === place.formatted_address)
      ) {
        places.splice(i, 1);
        i--;
      }
    } */
  };

  return {
    getCities,
    select,
    checkConfirm,
    places,
  };
});
