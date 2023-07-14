import temperatureLowerBound from './temperatureLowerBound.js';

describe("temperatureLowerBound ", () => {
    it("is 69 at 30% humidity", () => {
      expect(Math.round(temperatureLowerBound(0.3),0)).toEqual(69);
    });

    it("is 68 at 60% humidity", () => {
      expect(Math.round(temperatureLowerBound(0.6),0)).toEqual(68);
    });
})
