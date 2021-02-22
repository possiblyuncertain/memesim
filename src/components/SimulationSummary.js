import React from 'react';

import InfoBox from './InfoBox';

import '../styles.scss';

export default function SimulationSummary (props) {
  let world = props.worldState;
  return (
    <div className="spaced-across">
      <InfoBox label="Turn" value={world.turn} />
      <InfoBox label="People" value={world.population} />
      <InfoBox label="Spread" value={world.spread} />
    </div>
  );
}
