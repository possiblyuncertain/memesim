import React from 'react';

import './Dropdown.css';

export default function Dropdown (props) {
  let [showing, setShowing] = React.useState(false);

  return (
    <>
      <button className="dropdown" onClick={setShowing(! showing)}>
        <i className="fa fa-caret-down" />
      </button>
      <div className="dropdown-content">
        { props.children }
      </div>
    </>
  );
}
