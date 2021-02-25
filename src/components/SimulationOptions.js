import React from 'react';

import Dropdown from './Dropdown';

export default function SimulationOptions ({configure, config}) {
  return (
    <Dropdown>
      <form>
        <h4>Options</h4>

        <label for="rate">Rate</label>
        <input id="rate" name="rate"
          type="range" min="50" max="1000" step="50"
          value={config.tickTime}
          onChange={ e => configure('tickTime', e.target.valueAsNumber) }
        />

      </form>
    </Dropdown>
  );
};
