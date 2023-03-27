import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import TheNavigation from "../TheNavigation.vue";

describe("The Navigation", () => {
  it("renders correctly", () => {
    const wrapper = mount(TheNavigation);
    expect(wrapper.find(".logo").text()).toBe("rr-weather");
    expect(wrapper.find(".created").text()).toBe(
      "Created by Robert Rozehnal, 2023"
    );
  });

  it("checks the drawer variable when clicking", () => {
    const wrapper = mount(TheNavigation);
    let drawer;    

    drawer = wrapper.vm.drawer;
    expect(drawer).toBe(false);

    const menuIcon = wrapper.find(".svg-icon");
    menuIcon.trigger("click");

    //await nextTick();
    
    drawer = wrapper.vm.drawer;
    expect(drawer).toBe(true);

    wrapper.vm.drawerHandler();    

    drawer = wrapper.vm.drawer;
    expect(drawer).toBe(false);
  });
});
