import Forecast from './json/forecast.json';
import HourRow from './components/HourRow.jsx';

const forecast = Forecast;
const hours = forecast.data.timelines[0].intervals;

function App() {

  const listOfHours = hours.map(hour =>
    <HourRow 
      key = {hour.startTime} 
      startTime = {hour.startTime}
      temperature = {hour.values.temperature}
      dewpoint =  {hour.values.dewPoint}
    />
  );

  return (
    <div className="App">
      <>
      <div id="header">
        <h1>Sandex</h1>
      </div>
      <div id="forecast">
      <table className="styled-table">
          <thead>
          <tr>
            <th>Time</th>
            <th><span title="Temperature">Temp</span></th>
            <th><span title="Dewpoint">Dew</span></th>
            <th><span title="Wet Bulb">Wet</span></th>
          </tr>
          </thead>
          <tbody>
            { listOfHours }
          </tbody>
      </table>
      </div>
      <div id="wifir">
        <img src="/wifir.png" alt="The wifir is the logo for 'coworkout', an outdoor co-working group" width="249px" height="249px" />
      </div>
      </>
    </div>
  );
}

export default App;