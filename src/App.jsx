import { useState, useEffect, useCallback } from "react";
import DefaultForecast from "./json/forecast-openmeteo.json";
import ForecastChart from "./components/ForecastChart.jsx";
import HourCards from "./components/HourCards.jsx";

const DEFAULT_LOCATION_NAME = "West Chester, Pennsylvania";
const DEFAULT_LATITUDE = DefaultForecast.latitude;
const DEFAULT_LONGITUDE = DefaultForecast.longitude;

function parseForecastHours(forecast) {
  return forecast.hourly.time.map((startTime, index) => ({
    startTime,
    temperature: forecast.hourly.temperature_2m[index],
    dewpoint: forecast.hourly.dew_point_2m[index],
  }));
}

function isValidZip(zip) {
  return /^\d{5}$/.test(zip);
}

async function fetchLocationFromZip(zip) {
  const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
  if (!response.ok) {
    throw new Error(`Could not find location for zip code ${zip}`);
  }
  const data = await response.json();
  const place = data.places[0];
  return {
    name: `${place["place name"]}, ${place["state"]}`,
    latitude: parseFloat(place.latitude),
    longitude: parseFloat(place.longitude),
  };
}

async function fetchForecast(latitude, longitude) {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const fmt = (d) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const startDate = fmt(now);
  const endDate = fmt(new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000));
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}&longitude=${longitude}` +
    `&hourly=temperature_2m,dew_point_2m` +
    `&timezone=auto` +
    `&temperature_unit=fahrenheit` +
    `&start_date=${startDate}&end_date=${endDate}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Could not fetch weather forecast");
  }
  return response.json();
}

function App() {
  const [locationName, setLocationName] = useState(DEFAULT_LOCATION_NAME);
  const [latitude, setLatitude] = useState(DEFAULT_LATITUDE);
  const [longitude, setLongitude] = useState(DEFAULT_LONGITUDE);
  const [allHours, setAllHours] = useState(() =>
    parseForecastHours(DefaultForecast),
  );
  const [error, setError] = useState(null);
  const [hourCount, setHourCount] = useState(48);

  const [visibleWindow, setVisibleWindow] = useState(null);

  const handleVisibleWindowChange = useCallback((window) => {
    setVisibleWindow((prev) => {
      if (prev && prev.start === window.start && prev.end === window.end) {
        return prev;
      }
      return window;
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const zip = params.get("zip");

    if (!zip || !isValidZip(zip)) {
      return;
    }

    let cancelled = false;

    async function loadZipForecast() {
      try {
        const location = await fetchLocationFromZip(zip);
        if (cancelled) return;
        const forecast = await fetchForecast(location.latitude, location.longitude);
        if (cancelled) return;
        setLocationName(location.name);
        setLatitude(location.latitude);
        setLongitude(location.longitude);
        setAllHours(parseForecastHours(forecast));
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      }
    }

    loadZipForecast();

    return () => {
      cancelled = true;
    };
  }, []);

  const now = new Date();
  const futureHours = allHours.filter((hour) => new Date(hour.startTime) >= now);
  const hours = futureHours.slice(0, hourCount);

  const RANGE_OPTIONS = [
    { label: "2 days", value: 48 },
    { label: "3 days", value: 72 },
    { label: "7 days", value: 168 },
  ];

  return (
    <div className="App">
      <>
        <div id="header">
          <h1>Sandex</h1>
          <p id="location-subhead">Displaying upcoming weather for {locationName}.</p>
        </div>
        <div id="forecast">
          {error ? (
            <p id="forecast-error" role="alert">{error}</p>
          ) : (
            <>
              <ForecastChart
                hours={hours}
                latitude={latitude}
                longitude={longitude}
                visibleWindow={visibleWindow}
              />
              <div id="hour-range-control">
                {RANGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    className={`range-pill${hourCount === opt.value ? " range-pill-active" : ""}`}
                    onClick={() => setHourCount(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <HourCards
                hours={hours}
                latitude={latitude}
                longitude={longitude}
                onVisibleWindowChange={handleVisibleWindowChange}
              />
            </>
          )}
        </div>
        <div id="wifir">
          <img
            src="/wifir.png"
            alt="The wifir is the logo for 'coworkout', an outdoor co-working group"
            width="75px"
            height="75px"
          />
        </div>
      </>
    </div>
  );
}

export default App;
