import { React } from "react";

export function NoteHeader({
  key,
  isClicked,
  title,
  handleClick,
  children,
}) {
  return (
    <div
      className={`note-header ${isClicked ? "note-header--clicked" : ""}`}
      key={key}
      onClick={handleClick}
    >
      <span className="note-header__text">{title}</span>
      {children}
    </div>
  );
}
