import temperatureUpperBound from './temperatureUpperBound.mjs';

describe("temperatureUpperBound ", () => {
    it("is 82 at 30% humidity", () => {
      expect(Math.round(temperatureUpperBound(0.3),0)).toEqual(82);
    });

    it("is 78 at 60% humidity", () => {
      expect(Math.round(temperatureUpperBound(0.6),0)).toEqual(78);
    });
})