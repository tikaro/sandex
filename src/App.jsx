import Forecast from "./json/forecast-openmeteo.json";
import ForecastChart from "./components/ForecastChart.jsx";

const forecast = Forecast;
const hours = forecast.hourly.time.map((startTime, index) => ({
  startTime,
  temperature: forecast.hourly.temperature_2m[index],
  dewpoint: forecast.hourly.dew_point_2m[index],
}));

function App() {
  return (
    <div className="App">
      <>
        <div id="header">
          <h1>Sandex</h1>
        </div>
        <div id="forecast">
          <ForecastChart hours={hours} />
        </div>
        <div id="wifir">
          <img
            src="/wifir.png"
            alt="The wifir is the logo for 'coworkout', an outdoor co-working group"
            width="249px"
            height="249px"
          />
        </div>
      </>
    </div>
  );
}

export default App;
