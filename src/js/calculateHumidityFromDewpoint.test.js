import calculateHumidityFromDewpoint from './calculateHumidityFromDewpoint.js';

describe("Relative Humidity ", () => {
    it("is 51 at 67.89 degrees temp and 49.08 degrees dewpoint", () => {
      expect(Math.round(calculateHumidityFromDewpoint(67.89, 49.08),0)).toEqual(51);
    });

    it("is 62 at 95 degrees temp and 80 degrees dewpoint", () => {
        expect(Math.round(calculateHumidityFromDewpoint(95, 80),0)).toEqual(62);
      });
})