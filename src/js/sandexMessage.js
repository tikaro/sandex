import temperatureLowerBound from './temperatureLowerBound.js';
import temperatureUpperBound from './temperatureUpperBound.js';

export function humidityMessage(humidity) {
    const percentageHumidity = (+humidity / 100);
    // Air above 60% humidity never feels comfortable.
    if (percentageHumidity > 0.6) return `${humidity}% humidity is too humid.`;

    // Air below 30% humidity never feels comfortable.
    if (percentageHumidity < 0.3) return `${humidity}% humidity is too dry.`;

    return '';
}

export function temperatureMessage(temperature,humidity) {
    const percentageHumidity = (+humidity / 100);
    // Moister air can be slightly cooler and still feel comfortable.
    if (temperature <= temperatureLowerBound(percentageHumidity)) {
        return `${temperature}° is too cold.`;
    }

    // Dryer air can be much warmer and still feel comfortable.
    if (temperature >= temperatureUpperBound(percentageHumidity)) {
        return `${temperature}° is too hot.`;
    }

    return '';
}

export function sandexMessage(temperature, humidity) {
    let returnMessage = '';
    returnMessage += humidityMessage(humidity)
    returnMessage += temperatureMessage(temperature,humidity)
    return returnMessage;
}