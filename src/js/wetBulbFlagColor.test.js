import { wetBulbFlagColor } from './wetBulbFlagColor.js';

describe("wetBulbFlagColor", () => {
    it("should return 'white-flag' at 49 degrees ", () => {
      expect(wetBulbFlagColor(49)).toEqual('white-flag');
    });

    it("should return 'green-flag' at 82 degrees ", () => {
      expect(wetBulbFlagColor(82)).toEqual('green-flag');
    });

    it("should return 'yellow-flag' at 86 degrees ", () => {
      expect(wetBulbFlagColor(86)).toEqual('yellow-flag');
    });

    it("should return 'yellow-flag' at 86 degrees ", () => {
      expect(wetBulbFlagColor(86)).toEqual('yellow-flag');
    });

    it("should return 'red-flag' at 89 degrees ", () => {
      expect(wetBulbFlagColor(89)).toEqual('red-flag');
    });

    it("should return 'red-flag' at 90 degrees ", () => {
      expect(wetBulbFlagColor(90)).toEqual('black-flag');
    });

    it("should return 'red-flag' at 100 degrees ", () => {
      expect(wetBulbFlagColor(100)).toEqual('black-flag');
    });

});