import React from 'react';
import isSandex from '../js/isSandex.js';
import sandexMessage from '../js/sandexMessage.js';
import dewpointComfort from '../js/dewpointComfort.js';

export default function HourRow(props) {
    const rowTime = new Date(props.hour.startTime);
    const timeNow = new Date();
    const options = { weekday: 'long', month: 'long', hour: 'numeric', day: 'numeric' };

    const temperature = props.hour.values.temperature;
    const humidity = props.hour.values.humidity;
    const dewpoint = props.hour.values.dewPoint;

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
            <td className={`dewpoint dewpoint-${dewpointComfort(dewpoint)}`}>{Math.round(dewpoint,0)}&deg;</td>
        </tr>
    );
  }