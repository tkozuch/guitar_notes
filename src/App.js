import "./App.css";

import { React, useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCaretDown,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import { Editor } from "react-draft-wysiwyg";
import { ContentState } from "draft-js";
import "../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

library.add(faCaretDown, faMinus, faPlus);

const rawState = {
  content: {
    blocks: [
      {
        key: "5u4m2",
        text: " ",
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
    ],
    entityMap: {},
  },
};
console.log("RS created.", rawState);

function App() {
  const [expandedNote, setExpandedNote] = useState({
    index: -1,
    note: {
      title: undefined,
      content: undefined,
    },
  });
  const [songNotes, setSongNotes] = useState([]);

  const inExpandedState = () => expandedNote.index !== -1;

  function toggleNoteExpansion(index) {
    if (inExpandedState()) {
      setExpandedNote({
        index: -1,
        note: { title: undefined, content: undefined },
      });
    } else {
      setExpandedNote({ index, note: songNotes[index] });
    }
  }

  function deleteNote(index) {
    const notesCopy = [...songNotes];
    notesCopy.splice(index, 1);
    setSongNotes(notesCopy);
  }

  const saveData = useCallback(
    function () {
      console.log("Saving data: ", songNotes);
      fetch("http://127.0.0.1:8000/notes", {
        method: "POST",
        body: JSON.stringify(songNotes),
      });
    },
    [songNotes]
  );

  useEffect(function initializeData() {
    fetch("http://127.0.0.1:8000/notes", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((notesData) => {
        console.log("Data initialized: ", notesData);
        setSongNotes(notesData);
      });
  }, []);

  useEffect(
    function setEventListeners() {
      let checkEventPressed = function (event) {
        if (event.ctrlKey && event.key === "s") {
          event.preventDefault();
          saveData();
        }
      };
      document.addEventListener("keydown", checkEventPressed);
      return () => {
        document.removeEventListener("keydown", checkEventPressed);
      };
    },
    [saveData]
  );

  useEffect(() => {
    if (inExpandedState()) {
      const songNotesCopy = [...songNotes];
      songNotesCopy[expandedNote.index].content = expandedNote.note.content;
      setSongNotes(songNotesCopy);
    }
  }, [expandedNote.note.content]);

  console.log("CS", ContentState());

  return (
    <div className="App">
      <div className="container">
        <div className="header">Co grać na gitarze</div>

        {!inExpandedState() ? (
          [
            ...songNotes.map((note, index) => {
              return (
                <div className="note-header" key={index}>
                  <span className="note-header__text">{note.title}</span>
                  <button
                    className="note-header__minus-button"
                    onClick={() => deleteNote(index)}
                    key={index}
                  >
                    <FontAwesomeIcon icon="minus" size="2x"></FontAwesomeIcon>
                  </button>
                  <button
                    className="note-header__toggle-button"
                    onClick={() => toggleNoteExpansion(index)}
                  >
                    <FontAwesomeIcon icon="caret-down" size="3x" />
                  </button>
                </div>
              );
            }),
            <button
              onClick={function addSong() {
                const name = prompt("Song name:");
                setSongNotes([
                  ...songNotes,
                  { title: name, content: undefined },
                ]);
              }}
            >
              <FontAwesomeIcon icon="plus" size="3x"></FontAwesomeIcon>
              Add
            </button>,
          ]
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
                  const n = {
                    ...expandedNote.note,
                    content: contentState,
                  };
                  console.log("setting: ", n);
                  setExpandedNote({
                    index: expandedNote.index,
                    note: n,
                  });
                }}
                initialContentState={
                  expandedNote.note.content
                    ? expandedNote.note.content
                    : rawState.content
                }
              ></Editor>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
