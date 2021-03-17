import forecast from '../src/json/forecast.json';
const hours = forecast.data.timelines[0].intervals;
import isSandex from '../src/js/isSandex.js';

const sandexHours = hours.filter(hour => isSandex(hour.values.temperature, hour.values.humidity))

let foundSandex = false;
let sandexMessage = '';

if ( sandexHours.length > 0 ) {
  foundSandex = true;
  const nextSandexTime = new Date(sandexHours.shift().startTime);
  const options = { weekday: 'long', month: 'long', hour: 'numeric', day: 'numeric' };
  const nextSandexTimeString = nextSandexTime.toLocaleTimeString('en-US',options)
  sandexMessage = `Sandex coming up on ${nextSandexTimeString} https://sandex.netlify.app`
}

if (foundSandex) { console.log(sandexMessage) }
