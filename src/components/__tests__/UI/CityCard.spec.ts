import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import CityCard from "@/components/UI/CityCard.vue";

describe("City Card", () => {
  it("checks the props", () => {
    const wrapper = mount(CityCard, {
      props: {
        city: "Praha",
        highestTemp: 30,
        lowestTemp: -10,
        place_id: "qwertz123",
        rain: 2.5,
        temp_now: 12,
      },
    });

    expect(wrapper.find(".city-text").text()).toBe("Praha");
    expect(wrapper.text()).toContain("Now: 12°C");
    expect(wrapper.text()).toContain("High: 30°C");
    expect(wrapper.text()).toContain("Low: -10°C");
    expect(wrapper.text()).toContain("Rain: 2.5mm");
  });

  it("checks if button delete emits correctly", () => {
    const wrapper = mount(CityCard, {
      props: {
        city: "Brno",
        highestTemp: 20,
        lowestTemp: -15,
        place_id: "qwertz123abc",
        rain: 1.5,
        temp_now: 22,
      },
    });

    wrapper.find(".cancel").trigger("click");
    expect(wrapper.emitted("deleteCity")).toBeTruthy();
    expect(wrapper.emitted("deleteCity")![0]).toEqual(["qwertz123abc", "Brno"]);
  });
});
