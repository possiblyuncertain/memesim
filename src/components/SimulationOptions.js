import React from 'react';

import Dropdown from './Dropdown';
import OptionsInput from './OptionsInput';

export default function SimulationOptions ({configure, config}) {
  return (
    <Dropdown>
      <form>
        <h4>Simulation Options</h4>

        <OptionsInput name='step rate' min="1" max="10" step="1"
          value={Math.floor(1000 / config.tickTime)}
          update={ val => configure('tickTime', Math.floor(1000 / val)) }
        />

        <OptionsInput name='population' min="2" max="10000" logScale="true"
          value={config.population}
          update={ val => configure('population', val, true) }
        />

        <OptionsInput name='world size' min="1000" max="10000"
          value={config.size.x}
          update={ val => configure('size', { x: val, y: val }, true) }
        />

        <OptionsInput name='reasonableness' min="0" max="1" scale="10"
          value={config.reasonableness}
          update={ val => configure('reasonableness', val, true) }
        />

        <OptionsInput name='tribalism' min="0" max="1" scale="10"
          value={config.tribalism}
          update={ val => configure('tribalism', val, true) }
        />

      </form>
    </Dropdown>
  );
};
