import React from 'react';

export default function HourRow(props) {
    console.log(props);
    return (
        <tr className="hour">
            <td className="time">{props.hour.startTime}</td>
            <td className="temp">{props.hour.values.temperature}&deg;</td>
            <td className="humidity">{props.hour.values.humidity}%</td>
            <td className="dewpoint">{props.hour.values.dewPoint}&deg;</td>
        </tr>
    );
  }