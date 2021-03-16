import temperatureUpperBound from './temperatureUpperBound.js';

describe("temperatureUpperBound ", () => {
    test("is 82 at 30% humidity", () => {
      expect(Math.round(temperatureUpperBound(0.3),0)).toEqual(82);
    });

    test("is 78 at 60% humidity", () => {
      expect(Math.round(temperatureUpperBound(0.6),0)).toEqual(78);
    });
})