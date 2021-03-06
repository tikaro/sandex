import React from 'react';
import isSandex from '../js/isSandex.js';
import sandexMessage from '../js/sandexMessage.js';

export default function HourRow(props) {
    const time = new Date(props.hour.startTime);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const temperature = props.hour.values.temperature;
    const humidity = props.hour.values.humidity;
    const dewpoint = props.hour.values.dewPoint;

    return (
        <tr className="hour">
            <td className="time">{time.toLocaleTimeString('en-US',options)}</td>
            <td className="temp">{temperature}&deg;F</td>
            <td className="humidity">{humidity}%rh</td>
            <td className="dewpoint">{dewpoint}&deg;F</td>
            <td className="isSandex">{isSandex(temperature, humidity).toString()}</td>
            <td className="sandexMessage">{sandexMessage(temperature, humidity)}</td>
        </tr>
    );
  }