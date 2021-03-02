import React from 'react';

import '../../styles.scss';

export default function SimulationControls (props) {

  function highlight (button) {
    return props.highlight[button] ? 'pulse hop': '';
  }

  return (
    <div className="spaced-across centered">

      <button
        className={'item control-button ' +  highlight('reset')}
        onClick={props.reset}>
        <i className="fa fa-step-backward" />
      </button>

      <button
        className={'item control-button ' +  highlight('play')}
        onClick={props.togglePlay}>
        { props.playing ?
          <i className="fa fa-pause" />
          : <i className="fa fa-play" />
        }
      </button>

      <button
        className={'item control-button ' +  highlight('step')}
        onClick={props.step}>
        <i className="fa fa-step-forward" />
      </button>

    </div>
  );
}
