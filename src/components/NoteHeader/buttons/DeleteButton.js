import { React } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function DeleteButton({ handleClick }) {
  return (
    <button
      className="btn-delete btn-unstyled"
      onClick={(event) => handleClick(event)}
    >
      <FontAwesomeIcon icon="trash-alt" className="minus_icon" size="2x" />
    </button>
  );
}
