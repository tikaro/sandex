export default function temperatureUpperBound(percentageHumidity) {
    // at 30% relative humidity, anything above 82° is too hot.
    // at 60% relative humidity, anything above 78° is too hot.
    let temperatureUpperBound = (-13.3333333 * percentageHumidity) + 86;
    
    // console.log('temperatureUpperBound is ' + temperatureUpperBound);
    return temperatureUpperBound;
}