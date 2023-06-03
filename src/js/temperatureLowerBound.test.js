import temperatureLowerBound from './temperatureLowerBound.mjs';

describe("temperatureLowerBound ", () => {
    test("is 69 at 30% humidity", () => {
      expect(Math.round(temperatureLowerBound(0.3),0)).toEqual(69);
    });

    test("is 68 at 60% humidity", () => {
      expect(Math.round(temperatureLowerBound(0.6),0)).toEqual(68);
    });
})
