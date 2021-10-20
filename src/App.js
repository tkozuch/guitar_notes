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
  const [expandedNote, setExpandedNote] = useState(-1);
  const [inExpandedState, setInExpandedState] = useState(false);
  const [songNotes, setSongNotes] = useState(notes);
  const [expandedNoteContent, setExpandedNoteContent] = useState(() => null);
  

  function toggleNoteExpansion(index) {
    if (inExpandedState) {
      setInExpandedState(false);
    } else {
      setExpandedNote(index);
      setInExpandedState(true);
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

    // listen for when to Save notes.
    // TODO: not working, probably has constant songNotes value.
    // document.addEventListener("keydown", function (event) {
    //   if (event.ctrlKey && event.key === "s") {
    //     event.preventDefault();
    //     console.log("saving");
    //     fetch("http://127.0.0.1:8000/notes", {
    //       method: "POST",
    //       body: JSON.stringify(songNotes),
    //     });
    //   }
    // });
  }, []);

  useEffect(() => {
    if (inExpandedState) {
      const songNotesCopy = [...songNotes];
      console.log("content changing, ", expandedNoteContent);
      songNotesCopy[expandedNote].content = expandedNoteContent;
      setSongNotes(songNotesCopy);
      console.log("About to POST");
      fetch("http://127.0.0.1:8000/notes", {
        method: "POST",
        body: JSON.stringify(songNotes),
      });
    }
  }, [expandedNoteContent]);

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
          : (function renderNote() {
              const note = songNotes[expandedNote];
              return (
                <>
                  <div className="note-header">
                    <span className="note-header__text">{note.title}</span>
                    <button onClick={() => toggleNoteExpansion()}>
                      <FontAwesomeIcon icon="caret-down" size="3x" />
                    </button>
                  </div>
                  <div className="note-content">
                    <Editor
                      toolbarClassName="rich-text__toolbar"
                      onContentStateChange={(contentState) => {
                        setExpandedNoteContent(contentState);
                      }}
                      contentState={note.content}
                    ></Editor>
                  </div>
                </>
              );
            })()}
      </div>
    </div>
  );
}

export default App;
