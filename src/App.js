import './App.css';
import Forecast from './json/response.json';
import HourRow from './components/HourRow';

const forecast = Forecast;
const hours = forecast.data.timelines[0].intervals;



function App() {

  const listOfHours = hours.map(hour =>
    <HourRow hour={hour} />
  );

  return (
    <div className="App">
      <h1>Sandex</h1>
      <table>
          <thead>
          <tr>
            <th>Time</th>
            <th>Temperature</th>
            <th>Humidity</th>
            <th>Dewpoint</th>
            <th>Is Sandex?</th>
            <th>Why?</th>
          </tr>
          </thead>
          <tbody>
            { listOfHours }
          </tbody>
      </table>
    </div>
  );
}

export default App;
