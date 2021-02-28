import React from 'react';

import { Simulation, PopulationChart } from '../components';

export default function SimulationPage () {

  const [history, setHistory] = React.useState([]);
  const [histories, setHistories] = React.useState([]);
  const [currentConfig, setCurrentConfig] = React.useState({});

  const recordHistory = (worldState) => {
    // Copy current world state into world history
    setHistory([
      ...history,
      {...worldState},
    ]);
  }

  const startHistory = (worldConfig) => {
    setHistories([
      ...histories,
      {
        config: currentConfig,
        history: [...history],
      },
    ]);
    setHistory([]);
    setCurrentConfig({...worldConfig});
  }

  return (
    <>
      <Simulation
        startHistory={startHistory}
        recordHistory={recordHistory}
      />

      <PopulationChart history={history} />
    </>
  );
};
