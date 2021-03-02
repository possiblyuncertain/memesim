import React from 'react';

import './Dropdown.css';

export default function Dropdown (props) {
  let [showing, setShowing] = React.useState(false);

  return (
    <span className="dropdown">
      <button className="button-small" onClick={() => setShowing(! showing)}>
        <i className="fa fa-caret-down" />
      </button>
      { showing &&
        <div className="dropdown-content above">
          { props.children }
        </div>
      }
    </span>
  );
}
