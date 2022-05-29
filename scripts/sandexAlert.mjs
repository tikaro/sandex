import dotenv from 'dotenv';
dotenv.config();

import forecast from '../src/json/forecast.json';
const hours = forecast.data.timelines[0].intervals;

import calculateHumidityFromDewpoint from '../src/js/calculateHumidityFromDewpoint.mjs';
import { hourIsSandex } from '../src/js/isSandex.mjs';
import Twilio from 'twilio';

console.log(`hours.count is ${hours.length}`);

const sandexHours = hours.filter(hour => hourIsSandex(hour.values.temperature, calculateHumidityFromDewpoint(hour.values.temperature, hour.values.dewPoint)))

console.log(`sandexHours.count is ${sandexHours.length}`);

let foundSandex = false;
let sandexMessage = '';

if ( sandexHours.length > 0 ) {
  foundSandex = true;
  const nextSandexTime = new Date(sandexHours.shift().startTime);
  console.log(`nextSandexTime is ${nextSandexTime}`);
  const options = { timeZone:'America/New_York', weekday: 'long', month: 'long', hour: 'numeric', day: 'numeric' };
  const nextSandexTimeString = nextSandexTime.toLocaleTimeString('en-US',options)
  sandexMessage = `Sandex coming up on ${nextSandexTimeString}\nhttps://sandex.me`
}

if (foundSandex) { 
  console.log("Sandex found!")
  const environment = process.env.ENVIRONMENT;
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = new Twilio(accountSid, authToken);
  
  console.log(sandexMessage);

  if (environment != "dev") {
    console.log(`Sending Sandex message because environment is ${environment}`)
    client.messages
      .create({
        body: sandexMessage,
        from: '+12406182278',
        to: '+14846781977'
      })
      .then(message => console.log(message.sid));
  } else {
    console.log(`Not sending Twilio message because environment is ${environment}`)
  }
}
