import { React } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function AddButton({ handleClick }) {
  return (
    <button className="btn-add btn-unstyled" onClick={handleClick}>
      <FontAwesomeIcon
        icon="plus-circle"
        size="4x"
        className="plus-icon"
      ></FontAwesomeIcon>
    </button>
  );
}
