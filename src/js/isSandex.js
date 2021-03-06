import temperatureLowerBound from './temperatureLowerBound.js';
import temperatureUpperBound from './temperatureUpperBound.js';

export default function isSandex(temperature, humidity) {
    const percentageHumidity = (+humidity / 100);

    if (percentageHumidity > 0.6) return false;
    if (percentageHumidity < 0.3) return false;
    if (temperature <= temperatureLowerBound(percentageHumidity)) return false;
    if (temperature >= temperatureUpperBound(percentageHumidity)) return false;

    return true;
}