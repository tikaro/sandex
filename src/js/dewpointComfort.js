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

// Single source of truth for dewpoint comfort colors, shared by chart and cards.
export const DEWPOINT_COLORS = {
    "very-dry":    "var(--dewpoint-very-dry-color)",
    "dry":         "var(--dewpoint-dry-color)",
    "comfortable": "var(--dewpoint-comfortable-color)",
    "humid":       "var(--dewpoint-humid-color)",
    "muggy":       "var(--dewpoint-muggy-color)",
    "oppressive":  "var(--dewpoint-oppressive-color)",
    "miserable":   "var(--dewpoint-miserable-color)",
};

export function dewpointColor(dewpoint, comfort = dewpointComfort(dewpoint)) {
    return DEWPOINT_COLORS[comfort];
}

// ECharts piecewise visualMap pieces derived from the same boundaries and colors.
export const DEWPOINT_CHART_PIECES = [
    { lt: 50,              color: DEWPOINT_COLORS["very-dry"] },
    { gte: 50, lt: 56,     color: DEWPOINT_COLORS["dry"] },
    { gte: 56, lt: 61,     color: DEWPOINT_COLORS["comfortable"] },
    { gte: 61, lt: 66,     color: DEWPOINT_COLORS["humid"] },
    { gte: 66, lt: 71,     color: DEWPOINT_COLORS["muggy"] },
    { gte: 71, lt: 76,     color: DEWPOINT_COLORS["oppressive"] },
    { gte: 76,             color: DEWPOINT_COLORS["miserable"] },
];