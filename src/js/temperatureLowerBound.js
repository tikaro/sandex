export default function temperatureLowerBound(percentageHumidity) {
    // at 30% relative humidity, anything below 69° is too cold.
    // at 60% relative humidity, anything below 68° is too cold.
    let temperatureLowerBound = (-3.3333333 * percentageHumidity ) + 70;
    
    // console.log('temperatureLowerBound is ' + temperatureLowerBound);
    return temperatureLowerBound;
}