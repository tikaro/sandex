import sandexMessage from './sandexMessage.js';

describe("sandexMessage ", () => {
    test("is 'Too humid.' above 60% humidity", () => {
        expect(sandexMessage(72,61)).toBe("Too humid.");
    });

    test("is 'Too dry.' below 30% humidity", () => {
        expect(sandexMessage(72,29)).toBe("Too dry.");
    });

    test("is 'Too cold...' at 68 degrees and 30% humidity", () => {
        expect(sandexMessage(68,30)).toBe("Too cold for temperatureLowerBound of 69°");
    });

    test("is 'Too hot...' at 79 degrees and 60% humidity", () => {
        expect(sandexMessage(79,60)).toBe("Too hot for temperatureUpperBound of 78°");
    });

    test("is blank at 69 degrees and 60% humidity", () => {
        expect(sandexMessage(69,60)).toBe("");
    });
});