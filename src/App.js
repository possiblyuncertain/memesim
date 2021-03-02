import './App.css';
import './styles/styles.scss';

import { SimulationPage } from './pages';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>MEMESIM</h1>
      </header>
      <main className="App-main">
        <SimulationPage />
      </main>
    </div>
  );
}

export default App;
