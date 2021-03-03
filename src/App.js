import logo from './logo.svg';
import './App.css';
import Forecast from './json/climacell-api';
const forecast = Forecast;
const startTimes = forecast.data.timelines[0].intervals;

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
          <p>{JSON.stringify(startTimes)}</p>
      </header>
    </div>
  );
}

export default App;
