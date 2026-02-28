import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HourRow from "./HourRow";

function dayOrdinalSuffix(day) {
  if (day >= 11 && day <= 13) return "th";

  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function formatRowLabel(date) {
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const dayOfMonth = date.getDate();
  const hour = date
    .toLocaleTimeString("en-US", { hour: "numeric", hour12: true })
    .replace(" ", "");

  return `${weekday}, ${month} ${dayOfMonth}${dayOrdinalSuffix(dayOfMonth)}, ${hour}`;
}

function renderHourRow(startTime) {
  return render(
    <table>
      <tbody>
        <HourRow
          key={startTime}
          startTime={startTime}
          temperature={73.96}
          dewpoint={68.68}
        />
      </tbody>
    </table>,
  );
}

describe("Hour Row", () => {
  it("shows the default temperature", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    renderHourRow(tomorrow.toISOString());

    const textElement = screen.getByText(/74/i);
    expect(textElement).toBeInTheDocument();
  });

  it("shows weekday, month, day, and hour for dates less than seven days away", () => {
    const sixDaysFromNow = new Date();
    sixDaysFromNow.setDate(sixDaysFromNow.getDate() + 6);
    const startTime = sixDaysFromNow.toISOString();
    const expectedLabel = formatRowLabel(sixDaysFromNow);

    renderHourRow(startTime);

    expect(screen.getByText(expectedLabel)).toBeInTheDocument();
  });

  it("shows weekday, month, day, and hour for dates seven or more days away", () => {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const startTime = sevenDaysFromNow.toISOString();
    const expectedLabel = formatRowLabel(sevenDaysFromNow);

    renderHourRow(startTime);

    expect(screen.getByText(expectedLabel)).toBeInTheDocument();
    expect(screen.queryByText(/Next /i)).not.toBeInTheDocument();
  });
});
