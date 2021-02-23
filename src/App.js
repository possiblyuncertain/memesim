import './App.css';
import './styles.scss';

import { Simulation } from './components';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>MEMESIM</h1>
      </header>
      <main className="App-main">
        <Simulation height={800} width={800} />
      </main>
    </div>
  );
}

export default App;
