import React from 'react';

import InfoBox from './InfoBox';

import './SimulationSummary.css';

export default function SimulationSummary (props) {
  let world = props.worldState;
  return (
    <div className="spaced-across summary">
      <InfoBox label="Turn" value={world.turn} />
      <InfoBox label="People" value={world.population} />
      <InfoBox label="Spread" value={world.spread} />
    </div>
  );
}
