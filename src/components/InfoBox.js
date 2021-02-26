import React from 'react';

export default function InfoBox ({label, value}) {
  return (
    <div className="item">
      <h3>
        {label} <span className="value-box">{value}</span>
      </h3>
    </div>
  );
}
