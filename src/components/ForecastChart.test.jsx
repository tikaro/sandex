import { beforeAll, afterAll, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import ReactECharts from "echarts-for-react";
import ForecastChart from "./ForecastChart";

vi.mock("echarts-for-react", () => ({
  default: vi.fn(() => null),
}));

const HOURS = [
  {
    startTime: "2026-08-03T12:00:00.000Z",
    temperature: 74.6,
    dewpoint: 70.4,
  },
];

let originalResizeObserver;

beforeAll(() => {
  originalResizeObserver = global.ResizeObserver;
  global.ResizeObserver = class ResizeObserver {};
});

afterAll(() => {
  global.ResizeObserver = originalResizeObserver;
});

describe("ForecastChart tooltip formatting", () => {
  it("rounds chart overlay values to the nearest whole degree fahrenheit", () => {
    render(
      <ForecastChart
        hours={HOURS}
        latitude={39.96}
        longitude={-75.61}
        visibleWindow={null}
      />,
    );

    const option = ReactECharts.mock.calls[0][0].option;
    const temperatureFormatter = option.series[2].tooltip.valueFormatter;
    const dewpointFormatter = option.series[3].tooltip.valueFormatter;

    expect(temperatureFormatter(74.6)).toBe("75°F");
    expect(temperatureFormatter(74.4)).toBe("74°F");
    expect(dewpointFormatter(["label", 70.6])).toBe("71°F");
    expect(dewpointFormatter(["label", 70.4])).toBe("70°F");
  });
});

describe("ForecastChart option replacement", () => {
  it("passes notMerge={true} to prevent animation crashes when hour count changes", () => {
    render(
      <ForecastChart
        hours={HOURS}
        latitude={39.96}
        longitude={-75.61}
        visibleWindow={null}
      />,
    );

    const lastCall = ReactECharts.mock.calls[ReactECharts.mock.calls.length - 1][0];
    expect(lastCall.notMerge).toBe(true);
  });
});
