import React from 'react';
import calculateHumidityFromDewpoint from '../js/calculateHumidityFromDewpoint.js';
import { temperatureIsSandex, hourIsSandex } from '../js/isSandex.js';
import { temperatureMessage, sandexMessage } from '../js/sandexMessage.js';
import { dewpointComfort, dewpointComfortMessage } from '../js/dewpointComfort.js';
import calculateWetBulbTemp from '../js/calculateWetBulbTemp.js';
import { wetBulbFlagColor } from '../js/wetBulbFlagColor.js';

export default function HourRow({startTime, temperature, dewpoint}) {
    const rowTime = new Date(startTime);
    const timeNow = new Date();
    const options = { weekday: 'long', hour: 'numeric' };

    const humidity = calculateHumidityFromDewpoint(temperature, dewpoint);
    const wetbulbtemp = calculateWetBulbTemp(temperature, dewpoint);
    const temperatureIsSandexString = temperatureIsSandex(temperature, humidity).toString();
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
            <td 
                className={`dewpoint dewpoint-${dewpointComfort(dewpoint)}`}>
                <span 
                    title={`${dewpointComfortMessage(dewpoint)} at ${Math.round(dewpoint,0)}°.`} 
                >{`${Math.round(dewpoint,0)}°`}</span>
            </td>
            <td 
                className={`wetbulb ${wetBulbFlagColor(wetbulbtemp)} }`}>
                <span 
                    title="wetbulb" 
                >{`${Math.round(wetbulbtemp,0)}°`}</span>
            </td>
        </tr>
    );
  }