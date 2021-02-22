import React from 'react';

import '../styles.scss';

export default function SimulationControls (props) {
  return (
    <div className="spaced-across">
      <button className="item control-button" onClick={props.togglePlay}>
        { props.playing ?
          <i className="fa fa-pause" />
          : <i className="fa fa-play" />
        }
      </button>
      <button className="item control-button" onClick={props.step}><i className="fa fa-step-forward" /></button>
      <button className="item control-button" onClick={props.reset}><i className="fa fa-step-backward" /></button>
    </div>
  );
}
