import "./App.css";
import notes from "./notes.json";
import { convertFromRaw, convertToRaw } from "draft-js";
// import { RichText } from "./components/RichText";

import { React, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import "../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

library.add(faCaretDown);

const EMPTY_STATE = {
  blocks: [],
  entityMap: {},
};

const content = {
  entityMap: {},
  blocks: [
    {
      key: "637gr",
      text: "Initialized from content state.",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
  ],
};

// function App() {
//   const [state, setState] = useState(null);

//   useEffect(() => {
//     console.log("state, ", state);
//   }, [state]);

//   return (
//     <>
//       <Editor
//         defaultContentState={content}
//         onContentStateChange={(content) => {
//           setState(content);
//         }}
//       ></Editor>
//       <Editor contentState={state}></Editor>
//     </>
//   );
// }

function App() {
  const [expandedNote, setExpandedNote] = useState({
    index: -1,
    note: {
      title: undefined,
      content: undefined,
    },
  });
  const [songNotes, setSongNotes] = useState(notes);

  const inExpandedState = () => expandedNote.index !== -1;

  function toggleNoteExpansion(index) {
    if (inExpandedState()) {
      setExpandedNote({ index: -1, note: undefined });
    } else {
      setExpandedNote({ index, note: songNotes[index] });
    }
  }

  useEffect(() => {
    fetch("http://127.0.0.1:8000/notes", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((notesData) => {
        console.log("goot", notesData);
        setSongNotes(notesData);
      });
  }, []);

  useEffect(() => {
    if (inExpandedState()) {
      const songNotesCopy = [...songNotes];
      console.log("n: ", songNotesCopy[expandedNote.index], expandedNote.index);
      songNotesCopy[expandedNote.index].content = expandedNote.note.content;
      setSongNotes(songNotesCopy);
      console.log("About to POST");
      fetch("http://127.0.0.1:8000/notes", {
        method: "POST",
        body: JSON.stringify(songNotes),
      });
    }
  }, [expandedNote.note.content]);

  return (
    <div className="App">
      <div className="container">
        <div className="header">Co grać na gitarze</div>

        {!inExpandedState() ? (
          songNotes.map((note, index) => {
            return (
              <div className="note-header" key={index}>
                <span className="note-header__text">{note.title}</span>
                <button onClick={() => toggleNoteExpansion(index)}>
                  <FontAwesomeIcon icon="caret-down" size="3x" />
                </button>
              </div>
            );
          })
        ) : (
          <>
            <div className="note-header">
              <span className="note-header__text">
                {expandedNote.note.title}
              </span>
              <button onClick={() => toggleNoteExpansion()}>
                <FontAwesomeIcon icon="caret-down" size="3x" />
              </button>
            </div>
            <div className="note-content">
              <Editor
                toolbarClassName="rich-text__toolbar"
                onContentStateChange={(contentState) => {
                  setExpandedNote({
                    index: expandedNote.index,
                    note: {
                      ...expandedNote,
                      content: contentState,
                    },
                  });
                }}
                contentState={expandedNote.note.content}
              ></Editor>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
