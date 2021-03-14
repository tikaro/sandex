import './scss/index.scss';
import Forecast from './json/forecast.json';
import HourRow from './components/HourRow';

const forecast = Forecast;
const hours = forecast.data.timelines[0].intervals;



function App() {

  const listOfHours = hours.map(hour =>
    <HourRow key={hour.toStartTime} hour={hour} />
  );

  return (
    <div className="App">
      <>
      <div id="header">
        <h1>Sandex</h1>
      </div>
      <div id="forecast">
      <table>
          <thead>
          <tr>
            <th>Time</th>
            <th>Temp</th>
            <th><span title="Dewpoint">Dew</span></th>
          </tr>
          </thead>
          <tbody>
            { listOfHours }
          </tbody>
      </table>
      </div>
      </>
    </div>
  );
}

export default App;
