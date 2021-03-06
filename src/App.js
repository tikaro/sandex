import './App.css';
import Forecast from './json/response.json';
import HourRow from './components/HourRow';

const forecast = Forecast;
const startTimes = forecast.data.timelines[0].intervals;
const hours = forecast.data.timelines[0].intervals;

function App() {

  return (
    <div className="App">
      <h1>Sandex</h1>
      <table>
          <tr>
            <th>Time</th>
            <th>Temperature</th>
            <th>Humidity</th>
            <th>Dewpoint</th>
          </tr>
          <HourRow hour={hours[0]}/>
      </table>
    </div>
  );
}

export default App;
