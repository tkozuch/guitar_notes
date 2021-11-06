import { React } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function ExpandButton({ handleClick }) {
  return (
    <button className="btn-expand btn-unstyled" onClick={handleClick}>
      <FontAwesomeIcon
        id="filter"
        icon="caret-down"
        className="down_icon"
        size="3x"
      />
    </button>
  );
}
