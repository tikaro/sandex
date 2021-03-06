// These boundaries taken from the KDLT Weather Blog is here:
// https://kdltweather.blogspot.com/2009/05/summerlike-humidity-is-backfor-about.html

export function dewpointComfort(dewpoint) {

    if (dewpoint < 50) return "very-dry";
    if (dewpoint < 56) return "comfortable";
    if (dewpoint < 61) return "pleasant";
    if (dewpoint < 66) return "slightly-humid";
    if (dewpoint < 71) return "humid";
    if (dewpoint < 76) return "very-humid";
    if (dewpoint >= 76) return "oppressive";

}

export function dewpointComfortMessage(dewpoint) {
    let comfort = dewpointComfort(dewpoint);
    comfort = comfort.replace(/-/g, ' ');
    return comfort.charAt(0).toUpperCase() + comfort.slice(1);
}