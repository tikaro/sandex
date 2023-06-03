import { humidityMessage, temperatureMessage, sandexMessage } from './sandexMessage.mjs';

describe("humidityMessage ", () => {
    test("is 'Too humid.' above 60% humidity", () => {
        expect(humidityMessage(61)).toBe("61% humidity is too humid.");
    });

    test("is 'Too dry.' below 30% humidity", () => {
        expect(humidityMessage(29)).toBe("29% humidity is too dry.");
    });

    test("is blank at 69 degrees and 60% humidity", () => {
        expect(humidityMessage(60)).toBe("");
    });
});

describe("temperatureMessage ", () => {

    test("is 'Too cold at 68 degrees and 30% humidity", () => {
        expect(temperatureMessage(68,30)).toBe("68° is too cold.");
    });

    test("is 'Too hot at 79 degrees and 60% humidity", () => {
        expect(temperatureMessage(79,60)).toBe("79° is too hot.");
    });

    test("is blank at 69 degrees and 60% humidity", () => {
        expect(temperatureMessage(69,60)).toBe("");
    });
});


describe("sandexMessage ", () => {
    test("is Too hot and humid above 60% humidity", () => {
        expect(sandexMessage(84,61)).toBe("61% humidity is too humid.84° is too hot.");
    });

    test("is blank at 69 degrees and 60% humidity", () => {
        expect(sandexMessage(69,60)).toBe("");
    });
});