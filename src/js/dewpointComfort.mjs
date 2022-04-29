// The boundaries are taken from WeatherSpark:
// https://weatherspark.com/y/22733/Average-Weather-in-West-Chester-Pennsylvania-United-States-Year-Round#Sections-Humidity
// These boundaries on the KDLT Weather Blog are also fun to look at:
// https://kdltweather.blogspot.com/2009/05/summerlike-humidity-is-backfor-about.html

export function dewpointComfort(dewpoint) {

    if (dewpoint < 50) return "very-dry";
    if (dewpoint < 56) return "dry";
    if (dewpoint < 61) return "comfortable";
    if (dewpoint < 66) return "humid";
    if (dewpoint < 71) return "muggy";
    if (dewpoint < 76) return "oppressive";
    if (dewpoint >= 76) return "miserable";

}

export function dewpointComfortMessage(dewpoint) {
    let comfort = dewpointComfort(dewpoint);
    comfort = comfort.replace(/-/g, ' ');
    return comfort.charAt(0).toUpperCase() + comfort.slice(1);
}