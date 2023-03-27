import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import CityButton from "@/components/UI/CityButton.vue";

describe("City Button", () => {
  it("checks if there is name variable", () => {
    const name = "Brno";
    const wrapper = mount(CityButton, {
      props: { name },
    });
    const buttonCity = wrapper.find(".button-city");
    expect(buttonCity.text()).toBe(name);
  });
});
