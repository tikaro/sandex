import dotenv from 'dotenv';
dotenv.config();

import forecast from '../src/json/forecast.json' assert { type: 'json' };
const hours = forecast.data.timelines[0].intervals;
import hourIsSandex from '../src/js/isSandex.mjs';
import Twilio from 'twilio';

const sandexHours = hours.filter(hour => hourIsSandex(hour.values.temperature, hour.values.humidity))

let foundSandex = false;
let sandexMessage = '';

if ( sandexHours.length > 0 ) {
  foundSandex = true;
  const nextSandexTime = new Date(sandexHours.shift().startTime);
  const options = { timeZone:'America/New_York', weekday: 'long', month: 'long', hour: 'numeric', day: 'numeric' };
  const nextSandexTimeString = nextSandexTime.toLocaleTimeString('en-US',options)
  sandexMessage = `Sandex coming up on ${nextSandexTimeString}\nhttps://sandex.netlify.app`
}

if (foundSandex) { 
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = new Twilio(accountSid, authToken);
  
  console.log(sandexMessage);
  client.messages
    .create({
       body: sandexMessage,
       from: '+12406182278',
       to: '+14846781977'
     })
    .then(message => console.log(message.sid));
 }
