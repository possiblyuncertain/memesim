import React from 'react';

import InfoBox from '../generic/InfoBox';

export default function SimulationSummary (props) {
  let world = props.worldState;
  return (
    <span className="flex-across no-padding">
      <InfoBox label="Turn" value={world.turn} />
      <InfoBox label="People" value={world.population} />
      <InfoBox label="Spread" value={world.spread} />
    </span>
  );
}
