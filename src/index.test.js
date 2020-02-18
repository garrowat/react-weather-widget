import React from "react";
import ReactDOM from "react-dom";
import App, { getTemps, groupByDay, formatWeatherData } from "./index";

describe("App", () => {
  it("should render without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  describe("Get temperatures and icons", () => {
    it("should return an array", () => {
      const temps = getTemps([]);
      expect(Array.isArray(temps)).toBe(true);
    });
  });
});
