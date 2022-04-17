import React from 'react';
import {temperatureIsSandex, humidityIsSandex, hourIsSandex } from '../js/isSandex.js';
import { humidityMessage, temperatureMessage, sandexMessage } from '../js/sandexMessage.js';
import { dewpointComfort, dewpointComfortMessage } from '../js/dewpointComfort.js';

export default function HourRow({startTime, temperature, humidity, dewpoint}) {
    const rowTime = new Date(startTime);
    const timeNow = new Date();
    const options = { weekday: 'long', hour: 'numeric' };

    const temperatureIsSandexString = temperatureIsSandex(temperature, humidity).toString();
    const humidityIsSandexString = humidityIsSandex(humidity).toString();
    const hourIsSandexString = hourIsSandex(temperature, humidity).toString();

    if ( rowTime < timeNow ) return null;

    return (
        <tr className={`hour sandex-${hourIsSandexString}`}>
            <td className="time">
                <span title={`${sandexMessage(temperature, humidity)}`}>
                    {rowTime.toLocaleTimeString('en-US',options)}
                </span>
            </td>
            <td className={`temp sandex-${temperatureIsSandexString}`}>
                <span
                    title={`${temperatureMessage(temperature,humidity)}`}
                >
                    {Math.round(temperature,0)}&deg;
                </span>
            </td>
            <td className={`humidity sandex-${humidityIsSandexString}`}>
                <span
                    title={`${humidityMessage(humidity)}`}
                >
                    {Math.round(humidity,0)}%
                </span>
            </td>
            <td 
                className={`dewpoint dewpoint-${dewpointComfort(dewpoint)}`}>
                <span 
                    title={`${dewpointComfortMessage(dewpoint)} at ${Math.round(dewpoint,0)}°.`} 
                >{`${Math.round(dewpoint,0)}°`}</span>
            </td>
        </tr>
    );
  }