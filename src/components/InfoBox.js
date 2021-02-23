import React from 'react';

import './InfoBox.scss';

export default function InfoBox ({label, value}) {
  return (
    <div className="item infobox">
      <h3>
        {label} <span>{value}</span>
      </h3>
    </div>
  );
}
