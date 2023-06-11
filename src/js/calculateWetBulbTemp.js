export default function calculateWetBulbTemp(temperature, dewpoint) {

    // Wet Bulb temperature is approximated as the temperature 
    // minus one-third of the difference between temperature and dewpoint
    // source: https://theweatherprediction.com/habyhints/170/

    const dewpointDepression = temperature - dewpoint
    const wetBulbTemp = temperature - (dewpointDepression / 3)
        
    return wetBulbTemp;
}