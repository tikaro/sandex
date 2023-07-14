export default function calculateHumidityFromDewpoint(temperature, dewpoint) {


    // RH: =100*(EXP((17.625*TD)/(243.04+TD))/EXP((17.625*T)/(243.04+T)))
    // source: https://bmcnoldy.rsmas.miami.edu/Humidity.html

    const temperatureInCelsius = (5/9) * ( temperature - 32 )
    const dewpointInCelsius = (5/9) * ( dewpoint - 32)

    const relativeHumidity = 100 * ( Math.exp((17.625 * dewpointInCelsius )/(243.04 + dewpointInCelsius )) / Math.exp((17.625 * temperatureInCelsius )/(243.04 + temperatureInCelsius )));
    
    return relativeHumidity;
}