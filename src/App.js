import "./App.css";
import { useState } from "react";

import notes from "./notes.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

library.add(faCaretDown);

function App() {
  const [expandedNote, setExpandedNote] = useState(-1);
  const [inExpandedState, setInExpandedState] = useState(false);
  const [songNotes, setSongNotes] = useState(notes);

  function toggleNoteExpansion(index) {
    if (inExpandedState) {
      setInExpandedState(false);
    } else {
      setExpandedNote(index);
      setInExpandedState(true);
    }
  }

  return (
    <div className="App">
      <div className="container">
        <div className="header">Co grać na gitarze</div>
        {!inExpandedState
          ? songNotes.map((note, index) => {
              return (
                <div className="note-header" key={index}>
                  <span className="note-header__text">{note.title}</span>
                  <button onClick={() => toggleNoteExpansion(index)}>
                    <FontAwesomeIcon icon="caret-down" size="3x" />
                  </button>
                </div>
              );
            })
          : (() => {
              const note = songNotes[expandedNote];
              return (
                <div className="note-header">
                  <span className="note-header__text">{note.title}</span>
                  <button onClick={() => toggleNoteExpansion()}>
                    <FontAwesomeIcon icon="caret-down" size="3x" />
                  </button>
                </div>
              );
            })()}
      </div>
    </div>
  );
}

export default App;
