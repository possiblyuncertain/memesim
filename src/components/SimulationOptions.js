import React from 'react';

export default function SimulationOptions (props) {

  function changeRate (val) {
    props.configure('rate', val);
  }

  return (
    <div>
      <button className="item dropdown" >
        <i className="fa fa-caret-down" />
        <form className="dropdown-content">
          <h4>Options</h4>
          <label for="rate">Rate</label>
          <input id="rate" name="rate" type="number" onChange={val => props.configure('rate', val)} /> 
        </form>
      </button>
    </div>
  );
};
