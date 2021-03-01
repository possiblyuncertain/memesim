import React from 'react';

import styles from './OptionsInput.module.css';
import {capitalise} from '../utils';

const LOG_RESOLUTION_INCREASE = 1000;

export default function OptionsInput (props) {

  const safeName = props.name.replace(' ', '-');
  let {min, max, value} = props;

  let update = (changeEvt) => {
    props.update(changeEvt.target.valueAsNumber / (props.scale || 1));
  };

  if (props.scale) {
    min *= props.scale;
    max *= props.scale;
    value *= props.scale;
  }
  if (props.logScale) {
    // *range* inputs don't like non-integer values.
    // Need to clamp terminals to integer values, and scale up a bit to
    // increase the input resolution (steps too small using just log ints)
    min = Math.floor(Math.log(min) * LOG_RESOLUTION_INCREASE + 1);
    max = Math.floor(Math.log(max) * LOG_RESOLUTION_INCREASE);
    value = Math.log(value) * LOG_RESOLUTION_INCREASE;

    update = (changeEvt) => {
      const val = changeEvt.target.valueAsNumber;
      props.update(
        Math.floor(Math.exp(val / LOG_RESOLUTION_INCREASE))
      );
    }
  }

  // NOTE: we are using *props.value*, *props.min*, *props.max* as
  // limit labels, but *value*, *min* and *max* as for the actual
  // inputs (these will differ for log scales)
  return (
    <div className={styles.option}>
      <label className={styles.label} htmlFor={`input-${safeName}`}>
        {capitalise(props.name)}
        <span className="value-box">{props.value}</span>
      </label>
      
      <p className={styles.slider}>
        <span className={styles.limit}>{props.min}</span>
        <input className={styles.input}
          id={`input-${safeName}`} name={safeName}
          type="range" min={min} max={max} step={props.step}
          value={value} onChange={update}
        />
        <span className={styles.limit}>{props.max}</span>
      </p>
    </div>
  );
}
