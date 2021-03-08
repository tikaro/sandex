import React from 'react';
import isSandex from '../js/isSandex.js';
import sandexMessage from '../js/sandexMessage.js';

export default function HourRow(props) {
    const time = new Date(props.hour.startTime);
    const options = { weekday: 'long', month: 'long', hour: 'numeric', minute: '2-digit', day: 'numeric' };

    const temperature = props.hour.values.temperature;
    const humidity = props.hour.values.humidity;
    const isSandexString = isSandex(temperature, humidity).toString();

    return (
        <tr className={`hour sandex-${isSandexString}`}>
            <td className="time">
                <span title={`${sandexMessage(temperature, humidity)}`}>
                    {time.toLocaleTimeString('en-US',options)}
                </span>
            </td>
            <td className="temp">{Math.round(temperature,0)}&deg;</td>
            <td className="humidity">{Math.round(humidity,0)}%</td>
        </tr>
    );
  }