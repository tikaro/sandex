import isSandex from './isSandex.js';

describe("isSandex ", () => {
    test("is too humid above 60% humidity", () => {
      expect(isSandex(72,61)).toBe(false);
    });

    test("is too dry below 30% humidity", () => {
      expect(isSandex(72,29)).toBe(false);
    });

    test("is too cold at 68 degrees and 30% humidity", () => {
      expect(isSandex(68,30)).toBe(false);
    });

    test("is just right at 69 degrees and 60% humidity", () => {
        expect(isSandex(69,60)).toBe(true);
      });

    test("is too hot above 78 degrees and 60% humidity", () => {
      expect(isSandex(79,60)).toBe(false);
    });

    test("is just right at 79 degrees and 30% humidity", () => {
      expect(isSandex(79,30)).toBe(true);
    });

    test("is too hot above 82 degrees and 30% humidity", () => {
      expect(isSandex(83,30)).toBe(false);
    });

    test("is just right at 72 degrees and 40% humidity", () => {
      expect(isSandex(72,40)).toBe(true);
    });

  });