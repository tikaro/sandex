import temperatureLowerBound from './temperatureLowerBound.js';
import temperatureUpperBound from './temperatureUpperBound.js';

export default function sandexMessage(temperature, humidity) {
    const percentageHumidity = (+humidity / 100);
    let returnMessage = '';

    // console.log('humidity is ' + humidity + '. percentageHumidity is ' + percentageHumidity );

    // Air above 60% humidity never feels comfortable.
    if (percentageHumidity > 0.6) returnMessage += "Too humid.";

    // Air below 30% humidity never feels comfortable.
    if (percentageHumidity < 0.3) returnMessage += "Too dry.";

    // Moister air can be slightly cooler and still feel comfortable.
    if (temperature <= temperatureLowerBound(percentageHumidity)) {
        returnMessage += `Too cold for temperatureLowerBound of ${Math.round(temperatureLowerBound(percentageHumidity),0)}°`;
    }

    // Dryer air can be much warmer and still feel comfortable.
    if (temperature >= temperatureUpperBound(percentageHumidity)) {
        returnMessage += `Too hot for temperatureUpperBound of ${Math.round(temperatureUpperBound(percentageHumidity),0)}°`;
    }

    return returnMessage;
}