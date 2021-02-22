import React from 'react';


export default function InfoBox ({label, value}) {
  return (
    <div className="item">
      <h3>{label}</h3>
      <p>{value}</p>
    </div>
  );
}
