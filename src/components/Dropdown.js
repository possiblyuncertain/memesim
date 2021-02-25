import React from 'react';

import './Dropdown.css';

export default function Dropdown (props) {
  let [showing, setShowing] = React.useState(false);

  return (
    <span>
      <button className="button-small dropdown" onClick={() => setShowing(! showing)}>
        <i className="fa fa-caret-down" />
        { showing &&
          <div className="dropdown-content above">
            { props.children }
          </div>
        }
      </button>
    </span>
  );
}
