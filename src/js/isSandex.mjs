import temperatureLowerBound from './temperatureLowerBound.mjs';
import temperatureUpperBound from './temperatureUpperBound.mjs';

export function temperatureIsSandex(temperature,humidity) {
    const percentageHumidity = (+humidity / 100);

    if (temperature <= temperatureLowerBound(percentageHumidity)) return false;
    if (temperature >= temperatureUpperBound(percentageHumidity)) return false;

    return true;
}

export function humidityIsSandex(humidity) {
    const percentageHumidity = (+humidity / 100);

    if (percentageHumidity > 0.6) return false;
    if (percentageHumidity < 0.3) return false;

    return true;
}


export function hourIsSandex(temperature, humidity) {
    return temperatureIsSandex(temperature,humidity) && humidityIsSandex(humidity)
}