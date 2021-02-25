import React from 'react';

import Dropdown from './Dropdown';

export default function SimulationOptions (props) {

  function changeRate (val) {
    props.configure('rate', val);
  }

  return (
    <Dropdown>
      <form>
        <h4>Options</h4>
        <label for="rate">Rate</label>
        <input id="rate" name="rate" type="number" onChange={val => props.configure('rate', val)} />
      </form>
    </Dropdown>
  );
};
