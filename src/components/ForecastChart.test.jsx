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
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

afterAll(() => {
  global.ResizeObserver = originalResizeObserver;
});

describe("ForecastChart with empty hours", () => {
  it("renders without crashing when hours is empty", () => {
    expect(() =>
      render(
        <ForecastChart
          hours={[]}
          latitude={39.96}
          longitude={-75.61}
          visibleWindow={null}
        />,
      ),
    ).not.toThrow();
  });
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
    const temperatureFormatter = option.series[1].tooltip.valueFormatter;
    const dewpointFormatter = option.series[2].tooltip.valueFormatter;

    expect(temperatureFormatter(74.6)).toBe("75°F");
    expect(temperatureFormatter(74.4)).toBe("74°F");
    expect(dewpointFormatter(70.6)).toBe("71°F");
    expect(dewpointFormatter(70.4)).toBe("70°F");
  });
});

describe("ForecastChart remount on data size change", () => {
  it("remounts the chart (new ECharts instance) when hours length changes to avoid lineAnimationDiff crash", () => {
    const { rerender, unmount } = render(
      <ForecastChart
        hours={HOURS}
        latitude={39.96}
        longitude={-75.61}
        visibleWindow={null}
      />,
    );

    const callsBefore = ReactECharts.mock.calls.length;

    const moreHours = [
      ...HOURS,
      {
        startTime: "2026-08-03T13:00:00.000Z",
        temperature: 76.0,
        dewpoint: 68.0,
      },
    ];

    rerender(
      <ForecastChart
        hours={moreHours}
        latitude={39.96}
        longitude={-75.61}
        visibleWindow={null}
      />,
    );

    // The key prop changes when hours.length changes, forcing React to unmount the
    // old ReactECharts and mount a new one. The mock should have been called again.
    expect(ReactECharts.mock.calls.length).toBeGreaterThan(callsBefore);

    unmount();
  });
});
