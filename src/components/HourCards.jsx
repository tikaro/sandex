import { useRef, useCallback, useEffect } from "react";
import SunCalc from "suncalc";
import calculateHumidityFromDewpoint from "../js/calculateHumidityFromDewpoint.js";
import { hourIsSandex } from "../js/isSandex.js";
import { dewpointComfort, dewpointColor } from "../js/dewpointComfort.js";

const CARD_WIDTH = 76;
const CARD_GAP_DESKTOP = 10;
const CARD_GAP_MOBILE = 8;

function isNightHour(date, latitude, longitude) {
  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return false;
  }
  const sunrise = SunCalc.getTimes(date, latitude, longitude).sunrise;
  const sunset = SunCalc.getTimes(date, latitude, longitude).sunset;
  return date < sunrise || date >= sunset;
}

function getDewpointChipStyle(dewpoint) {
  const category = dewpointComfort(dewpoint);
  const textStyles = {
    "very-dry":    { color: "#111" },
    "dry":         { color: "#111" },
    "comfortable": { color: "transparent", textShadow: "#111 0 0 1px" },
    "humid":       { color: "transparent", textShadow: "#111 0 0 2px" },
    "muggy":       { color: "transparent", textShadow: "#111 0 0 3px" },
    "oppressive":  { color: "transparent", textShadow: "#111 0 0 4px" },
    "miserable":   { color: "transparent", fontWeight: "bold", textShadow: "#fff 0 0 5px" },
  };
  return { backgroundColor: dewpointColor(dewpoint, category), ...textStyles[category] };
}

function formatCardLabel(date) {
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const hour = date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }).replace(" ", "");
  return `${weekday} ${hour}`;
}

function HourCard({ hour, latitude, longitude }) {
  const date = new Date(hour.startTime);
  const humidity = calculateHumidityFromDewpoint(hour.temperature, hour.dewpoint);
  const isSandex = hourIsSandex(hour.temperature, humidity);
  const isNight = isNightHour(date, latitude, longitude);
  const label = formatCardLabel(date);

  let cardBg;
  if (isSandex) {
    cardBg = "#0C0";
  } else if (isNight) {
    cardBg = "rgba(52,78,140,0.08)";
  } else {
    cardBg = "#F4F4F2";
  }

  const chipStyle = getDewpointChipStyle(hour.dewpoint);

  return (
    <div
      className="hour-card"
      style={{ backgroundColor: cardBg }}
      data-time={hour.startTime}
    >
      <div className="hour-card-label">{label}</div>
      <div className="hour-card-temp">{Math.round(hour.temperature)}&deg;</div>
      <div className="hour-card-dewpoint-chip" style={chipStyle}>
        {Math.round(hour.dewpoint)}&deg;
      </div>
    </div>
  );
}

export default function HourCards({ hours, latitude, longitude, onVisibleWindowChange }) {
  const stripRef = useRef(null);

  const computeWindow = useCallback(() => {
    const el = stripRef.current;
    if (!el || hours.length === 0) return;

    const isMobile = window.innerWidth < 600;
    const gap = isMobile ? CARD_GAP_MOBILE : CARD_GAP_DESKTOP;
    const stride = CARD_WIDTH + gap;

    const visibleStart = Math.round(el.scrollLeft / stride);
    const visibleCount = Math.ceil(el.clientWidth / stride);
    const visibleEnd = Math.min(visibleStart + visibleCount - 1, hours.length - 1);
    const clampedStart = Math.max(0, Math.min(visibleStart, hours.length - 1));

    onVisibleWindowChange({ start: clampedStart, end: visibleEnd });
  }, [hours, onVisibleWindowChange]);

  useEffect(() => {
    computeWindow();
  }, [computeWindow]);

  return (
    <div
      className="hour-cards-strip"
      ref={stripRef}
      onScroll={computeWindow}
    >
      {hours.map((hour) => (
        <HourCard
          key={hour.startTime}
          hour={hour}
          latitude={latitude}
          longitude={longitude}
        />
      ))}
    </div>
  );
}
