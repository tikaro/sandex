import calculateWetBulbTemp from './calculateWetBulbTemp.mjs';

describe("Wet Bulb temperature ", () => {
    it("is 33 at 42 degrees temp and 15 degrees dewpoint", () => {
      expect(Math.round(calculateWetBulbTemp(42, 15),0)).toEqual(33);
    });

    it("is 85 at 90 degrees temp and 75 degrees dewpoint", () => {
      expect(Math.round(calculateWetBulbTemp(90, 75),0)).toEqual(85);
    });
})