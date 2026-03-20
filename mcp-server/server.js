import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// --- Sandex calculation logic (ported from src/js/) ---

function calculateHumidityFromDewpoint(temperature, dewpoint) {
  const temperatureInCelsius = (5 / 9) * (temperature - 32);
  const dewpointInCelsius = (5 / 9) * (dewpoint - 32);
  return (
    100 *
    (Math.exp((17.625 * dewpointInCelsius) / (243.04 + dewpointInCelsius)) /
      Math.exp(
        (17.625 * temperatureInCelsius) / (243.04 + temperatureInCelsius)
      ))
  );
}

function temperatureLowerBound(percentageHumidity) {
  return -3.3333333 * percentageHumidity + 70;
}

function temperatureUpperBound(percentageHumidity) {
  return -13.3333333 * percentageHumidity + 86;
}

function humidityIsSandex(humidity) {
  const pct = humidity / 100;
  return pct >= 0.3 && pct <= 0.6;
}

function temperatureIsSandex(temperature, humidity) {
  const pct = humidity / 100;
  return (
    temperature > temperatureLowerBound(pct) &&
    temperature < temperatureUpperBound(pct)
  );
}

function hourIsSandex(temperature, humidity) {
  return temperatureIsSandex(temperature, humidity) && humidityIsSandex(humidity);
}

// --- Data fetching ---

const DEFAULT_LAT = 39.985963;
const DEFAULT_LON = -75.622057;
const DEFAULT_LOCATION = 'West Chester, PA';

async function resolveZip(zip) {
  const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
  if (!res.ok) throw new Error(`ZIP code ${zip} not found`);
  const data = await res.json();
  const place = data.places[0];
  return {
    lat: parseFloat(place.latitude),
    lon: parseFloat(place.longitude),
    location: `${place['place name']}, ${place['state abbreviation']}`,
  };
}

async function fetchForecast(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&hourly=temperature_2m,dew_point_2m` +
    `&temperature_unit=fahrenheit` +
    `&forecast_days=14` +
    `&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Forecast fetch failed: ${res.status}`);
  return res.json();
}

function buildHours(forecastData) {
  const { time, temperature_2m, dew_point_2m } = forecastData.hourly;
  return time.map((t, i) => {
    const temperature = temperature_2m[i];
    const dewpoint = dew_point_2m[i];
    const humidity = calculateHumidityFromDewpoint(temperature, dewpoint);
    const sandex = hourIsSandex(temperature, humidity);
    return { time: t, temperature, dewpoint, humidity: Math.round(humidity), sandex };
  });
}

async function getHoursForLocation(zip, lat, lon) {
  let location = DEFAULT_LOCATION;
  let resolvedLat = DEFAULT_LAT;
  let resolvedLon = DEFAULT_LON;

  if (zip) {
    const resolved = await resolveZip(zip);
    resolvedLat = resolved.lat;
    resolvedLon = resolved.lon;
    location = resolved.location;
  } else if (lat != null && lon != null) {
    resolvedLat = lat;
    resolvedLon = lon;
    location = `${lat}, ${lon}`;
  }

  const forecast = await fetchForecast(resolvedLat, resolvedLon);
  const hours = buildHours(forecast);
  const now = new Date().toISOString();

  // Only return future hours
  const futureHours = hours.filter((h) => h.time >= now.slice(0, 16));

  return { location, hours: futureHours, timezone: forecast.timezone };
}

// --- MCP Server ---

const server = new Server(
  { name: 'sandex', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_sandex_hours',
      description:
        'Get all upcoming hours in the 14-day forecast where the sandex is 100% (perfectly comfortable weather). Optionally specify a ZIP code or lat/lon; defaults to West Chester, PA.',
      inputSchema: {
        type: 'object',
        properties: {
          zip: { type: 'string', description: 'US ZIP code (e.g. "92101")' },
          lat: { type: 'number', description: 'Latitude (used if no ZIP)' },
          lon: { type: 'number', description: 'Longitude (used if no ZIP)' },
        },
      },
    },
    {
      name: 'get_sandex_windows',
      description:
        'Get contiguous time windows in the 14-day forecast where every hour is sandex (100% comfortable). Returns start/end times and how many hours each window lasts.',
      inputSchema: {
        type: 'object',
        properties: {
          zip: { type: 'string', description: 'US ZIP code (e.g. "92101")' },
          lat: { type: 'number', description: 'Latitude (used if no ZIP)' },
          lon: { type: 'number', description: 'Longitude (used if no ZIP)' },
        },
      },
    },
    {
      name: 'get_forecast',
      description:
        'Get the full 14-day hourly forecast with sandex status, temperature, dewpoint, and humidity for each hour.',
      inputSchema: {
        type: 'object',
        properties: {
          zip: { type: 'string', description: 'US ZIP code (e.g. "92101")' },
          lat: { type: 'number', description: 'Latitude (used if no ZIP)' },
          lon: { type: 'number', description: 'Longitude (used if no ZIP)' },
        },
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const { zip, lat, lon } = args ?? {};

  try {
    const { location, hours, timezone } = await getHoursForLocation(zip, lat, lon);

    if (name === 'get_sandex_hours') {
      const sandexHours = hours.filter((h) => h.sandex);
      if (sandexHours.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `No sandex hours found in the next 14 days for ${location} (timezone: ${timezone}).`,
            },
          ],
        };
      }
      const lines = sandexHours.map(
        (h) =>
          `${h.time}  ${h.temperature.toFixed(1)}°F  ${h.humidity}% RH  (dewpoint ${h.dewpoint.toFixed(1)}°F)`
      );
      return {
        content: [
          {
            type: 'text',
            text:
              `Sandex hours for ${location} (timezone: ${timezone}) — ${sandexHours.length} hour(s):\n\n` +
              `${'Time'.padEnd(20)} Temp     Humidity  Dewpoint\n` +
              `${'----'.padEnd(20)} ----     --------  --------\n` +
              lines.join('\n'),
          },
        ],
      };
    }

    if (name === 'get_sandex_windows') {
      const windows = [];
      let current = null;
      for (const h of hours) {
        if (h.sandex) {
          if (!current) {
            current = { start: h.time, end: h.time, hours: 1 };
          } else {
            current.end = h.time;
            current.hours++;
          }
        } else if (current) {
          windows.push(current);
          current = null;
        }
      }
      if (current) windows.push(current);

      if (windows.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `No sandex windows found in the next 14 days for ${location}.`,
            },
          ],
        };
      }

      const lines = windows.map(
        (w) => `  ${w.start} → ${w.end}  (${w.hours} hour${w.hours !== 1 ? 's' : ''})`
      );
      return {
        content: [
          {
            type: 'text',
            text:
              `Sandex windows for ${location} (timezone: ${timezone}) — ${windows.length} window(s):\n\n` +
              lines.join('\n'),
          },
        ],
      };
    }

    if (name === 'get_forecast') {
      const lines = hours.map((h) => {
        const status = h.sandex ? '✓' : ' ';
        return `[${status}] ${h.time}  ${h.temperature.toFixed(1).padStart(6)}°F  ${String(h.humidity).padStart(3)}% RH  dew ${h.dewpoint.toFixed(1)}°F`;
      });
      return {
        content: [
          {
            type: 'text',
            text:
              `Forecast for ${location} (timezone: ${timezone}) — [✓] = sandex hour\n\n` +
              lines.join('\n'),
          },
        ],
      };
    }

    return {
      content: [{ type: 'text', text: `Unknown tool: ${name}` }],
      isError: true,
    };
  } catch (err) {
    return {
      content: [{ type: 'text', text: `Error: ${err.message}` }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
