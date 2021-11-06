import { React } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function EditButton({ handleClick }) {
  return (
    <button className="btn-edit btn-unstyled">
      <FontAwesomeIcon
        icon="pencil-alt"
        size="1.5x"
        onClick={(event) => handleClick(event)}
      />
    </button>
  );
}
