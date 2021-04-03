import React from 'react';
import isSandex from '../js/isSandex.js';
import sandexMessage from '../js/sandexMessage.js';
import { dewpointComfort, dewpointComfortMessage } from '../js/dewpointComfort.js';

export default function HourRow(props) {
    const rowTime = new Date(props.startTime);
    const timeNow = new Date();
    const options = { weekday: 'long', hour: 'numeric' };

    const temperature = props.temperature;
    const humidity = props.humidity;
    const dewpoint = props.dewPoint;

    const isSandexString = isSandex(temperature, humidity).toString();

    if ( rowTime < timeNow ) return null;

    return (
        <tr className={`hour sandex-${isSandexString}`}>
            <td className="time">
                <span title={`${sandexMessage(temperature, humidity)}`}>
                    {rowTime.toLocaleTimeString('en-US',options)}
                </span>
            </td>
            <td className="temp">{Math.round(temperature,0)}&deg;</td>
            <td className="humidity">{Math.round(humidity,0)}%</td>
            <td className="dewpoint"><span title={`${dewpointComfortMessage(dewpoint)} at ${Math.round(dewpoint,0)}°.`} className={`dewpoint-bullet dewpoint-${dewpointComfort(dewpoint)}`}></span></td>
        </tr>
    );
  }