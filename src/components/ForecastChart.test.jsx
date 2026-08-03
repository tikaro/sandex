import { beforeAll, afterAll, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import ForecastChart from "./ForecastChart";

const mockSetOption = vi.fn();
const mockDispose = vi.fn();
const mockResize = vi.fn();

vi.mock("echarts", () => ({
  init: vi.fn(() => ({
    setOption: mockSetOption,
    dispose: mockDispose,
    resize: mockResize,
  })),
}));

import * as echarts from "echarts";

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
    mockSetOption.mockClear();

    render(
      <ForecastChart
        hours={HOURS}
        latitude={39.96}
        longitude={-75.61}
        visibleWindow={null}
      />,
    );

    expect(mockSetOption).toHaveBeenCalled();
    const option = mockSetOption.mock.calls[0][0];
    const temperatureFormatter = option.series[1].tooltip.valueFormatter;
    const dewpointFormatter = option.series[2].tooltip.valueFormatter;

    expect(temperatureFormatter(74.6)).toBe("75°F");
    expect(temperatureFormatter(74.4)).toBe("74°F");
    expect(dewpointFormatter(70.6)).toBe("71°F");
    expect(dewpointFormatter(70.4)).toBe("70°F");
  });
});

describe("ForecastChart remount on data size change", () => {
  it("creates a new ECharts instance when hours length changes to avoid lineAnimationDiff crash", () => {
    echarts.init.mockClear();
    mockDispose.mockClear();

    const { rerender, unmount } = render(
      <ForecastChart
        hours={HOURS}
        latitude={39.96}
        longitude={-75.61}
        visibleWindow={null}
      />,
    );

    const initCallsBefore = echarts.init.mock.calls.length;

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

    // When option changes (new hours), the effect re-runs: dispose old + init new
    expect(echarts.init.mock.calls.length).toBeGreaterThan(initCallsBefore);

    unmount();
  });
});

describe("ForecastChart remount on data content change", () => {
  it("creates a new ECharts instance when hours data changes but length stays the same", () => {
    echarts.init.mockClear();
    mockDispose.mockClear();

    const { rerender, unmount } = render(
      <ForecastChart
        hours={HOURS}
        latitude={39.96}
        longitude={-75.61}
        visibleWindow={null}
      />,
    );

    const initCallsBefore = echarts.init.mock.calls.length;

    // Same length as HOURS but different startTime (simulates loading a new zip forecast)
    const differentHours = [
      {
        startTime: "2026-08-10T12:00:00.000Z",
        temperature: 80.0,
        dewpoint: 65.0,
      },
    ];

    rerender(
      <ForecastChart
        hours={differentHours}
        latitude={39.96}
        longitude={-75.61}
        visibleWindow={null}
      />,
    );

    // Different data changes the option, so the effect re-runs: dispose old + init new
    expect(echarts.init.mock.calls.length).toBeGreaterThan(initCallsBefore);

    unmount();
  });
});
