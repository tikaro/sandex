import React from "react";
import calculateHumidityFromDewpoint from "../js/calculateHumidityFromDewpoint.js";
import { temperatureIsSandex, hourIsSandex } from "../js/isSandex.js";
import { temperatureMessage, sandexMessage } from "../js/sandexMessage.js";
import {
  dewpointComfort,
  dewpointComfortMessage,
} from "../js/dewpointComfort.js";

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

export default function HourRow({ startTime, temperature, dewpoint }) {
  const rowTime = new Date(startTime);
  const timeNow = new Date();
  const weekday = rowTime.toLocaleDateString("en-US", { weekday: "long" });
  const month = rowTime.toLocaleDateString("en-US", { month: "long" });
  const dayOfMonth = rowTime.getDate();
  const hour = rowTime
    .toLocaleTimeString("en-US", { hour: "numeric", hour12: true })
    .replace(" ", "");
  const rowLabel = `${weekday}, ${month} ${dayOfMonth}${dayOrdinalSuffix(dayOfMonth)}, ${hour}`;

  const humidity = calculateHumidityFromDewpoint(temperature, dewpoint);
  const temperatureIsSandexString = temperatureIsSandex(
    temperature,
    humidity,
  ).toString();
  const hourIsSandexString = hourIsSandex(temperature, humidity).toString();

  if (rowTime < timeNow) return null;

  return (
    <tr className={`hour sandex-${hourIsSandexString}`}>
      <td className="time">
        <span title={`${sandexMessage(temperature, humidity)}`}>
          {rowLabel}
        </span>
      </td>
      <td className={`temp sandex-${temperatureIsSandexString}`}>
        <span title={`${temperatureMessage(temperature, humidity)}`}>
          {Math.round(temperature, 0)}&deg;
        </span>
      </td>
      <td className={`dewpoint dewpoint-${dewpointComfort(dewpoint)}`}>
        <span
          title={`${dewpointComfortMessage(dewpoint)} at ${Math.round(dewpoint, 0)}°.`}
        >{`${Math.round(dewpoint, 0)}°`}</span>
      </td>
    </tr>
  );
}
