import { temperatureIsSandex, humidityIsSandex, hourIsSandex } from './isSandex.js';

describe("hourIsSandex ", () => {
    it("is too humid above 60% humidity", () => {
      expect(hourIsSandex(72,61)).toBe(false);
    });

    it("is too dry below 30% humidity", () => {
      expect(hourIsSandex(72,29)).toBe(false);
    });

    it("is too cold at 68 degrees and 30% humidity", () => {
      expect(hourIsSandex(68,30)).toBe(false);
    });

    it("is just right at 69 degrees and 60% humidity", () => {
        expect(hourIsSandex(69,60)).toBe(true);
      });

    it("is too hot above 78 degrees and 60% humidity", () => {
      expect(hourIsSandex(79,60)).toBe(false);
    });

    it("is just right at 79 degrees and 30% humidity", () => {
      expect(hourIsSandex(79,30)).toBe(true);
    });

    it("is too hot above 82 degrees and 30% humidity", () => {
      expect(hourIsSandex(83,30)).toBe(false);
    });

    it("is just right at 72 degrees and 40% humidity", () => {
      expect(hourIsSandex(72,40)).toBe(true);
    });

  });