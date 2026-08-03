import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import HourCards from "./HourCards";
import { dewpointColor, DEWPOINT_COLORS } from "../js/dewpointComfort.js";

const BASE_TIME = new Date(Date.now() + 60 * 60 * 1000).toISOString();

function makeHour(temperature, dewpoint, startTime = BASE_TIME) {
  return { startTime, temperature, dewpoint };
}

function renderCards(hours) {
  return render(
    <HourCards
      hours={hours}
      latitude={39.96}
      longitude={-75.61}
      onVisibleWindowChange={vi.fn()}
    />,
  );
}

// Convert a CSS hex color (e.g. "#FE0000" or "#0CF") to the rgb() string that
// the DOM returns from element.style.backgroundColor.
function hexToRgb(hex) {
  const normalized = hex.replace(/^#/, "");
  const full =
    normalized.length === 3
      ? normalized.split("").map(c => c + c).join("")
      : normalized;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

describe("HourCards dewpoint display", () => {
  it("displays dewpoint rounded to the nearest degree", () => {
    const { container } = renderCards([makeHour(75, 71.3)]);
    const chip = container.querySelector(".hour-card-dewpoint-chip");
    expect(chip.textContent).toBe("71°");
  });

  it("rounds a decimal dewpoint (70.9) to the nearest degree for display", () => {
    const { container } = renderCards([makeHour(75, 70.9)]);
    const chip = container.querySelector(".hour-card-dewpoint-chip");
    expect(chip.textContent).toBe("71°");
  });

  it("rounds a decimal dewpoint (71.5) to the nearest degree for display", () => {
    const { container } = renderCards([makeHour(75, 71.5)]);
    const chip = container.querySelector(".hour-card-dewpoint-chip");
    expect(chip.textContent).toBe("72°");
  });
});

describe("HourCards dewpoint chip color", () => {
  it("applies the correct background color based on the raw (unrounded) dewpoint", () => {
    const { container } = renderCards([makeHour(75, 71.3)]);
    const chip = container.querySelector(".hour-card-dewpoint-chip");
    expect(chip.style.backgroundColor).toBe(hexToRgb(dewpointColor(71.3)));
    expect(chip.style.backgroundColor).toBe(hexToRgb(DEWPOINT_COLORS["oppressive"]));
  });

  it("uses raw dewpoint for color even when rounding would change the comfort level", () => {
    // 70.9 rounds to 71° for display, but color is "muggy" (70.9 < 71 threshold)
    const { container } = renderCards([makeHour(75, 70.9)]);
    const chip = container.querySelector(".hour-card-dewpoint-chip");
    expect(chip.textContent).toBe("71°");
    expect(chip.style.backgroundColor).toBe(hexToRgb(DEWPOINT_COLORS["muggy"]));
  });

  it("colors oppressive (red) when dewpoint is exactly at the 71 threshold", () => {
    const { container } = renderCards([makeHour(75, 71.0)]);
    const chip = container.querySelector(".hour-card-dewpoint-chip");
    expect(chip.textContent).toBe("71°");
    expect(chip.style.backgroundColor).toBe(hexToRgb(DEWPOINT_COLORS["oppressive"]));
  });

  it("chip color matches what dewpointColor() returns for each comfort level", () => {
    const cases = [
      { dewpoint: 40,   level: "very-dry" },
      { dewpoint: 52,   level: "dry" },
      { dewpoint: 58,   level: "comfortable" },
      { dewpoint: 63,   level: "humid" },
      { dewpoint: 68,   level: "muggy" },
      { dewpoint: 73,   level: "oppressive" },
      { dewpoint: 78,   level: "miserable" },
    ];

    cases.forEach(({ dewpoint, level }) => {
      const { container } = renderCards([makeHour(75, dewpoint)]);
      const chip = container.querySelector(".hour-card-dewpoint-chip");
      expect(chip.style.backgroundColor).toBe(hexToRgb(DEWPOINT_COLORS[level]));
    });
  });
});
