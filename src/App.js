import "./App.css";

import { React, useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCaretDown,
  faMinus,
  faPlus,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

import { Editor } from "react-draft-wysiwyg";
import "../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

library.add(faCaretDown, faMinus, faPlus, faTrashAlt);

const emptyState = {
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

function App() {
  const [expandedNote, setExpandedNote] = useState({
    index: -1,
    note: {
      title: undefined,
      content: undefined,
    },
  });
  const [songNotes, setSongNotes] = useState([]);
  const noteClicked = songNotes.filter((note) => note.clicked);

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

  function setNoteClicked(index) {
    const notesCopy = [...songNotes];
    const previouslyClicked = notesCopy.find((value) => value.clicked); // cancel the previous note being clicked.
    const previouslyClickedIndex = notesCopy.findIndex(
      (value) => value.clicked
    );
    const note = notesCopy[index];

    if (previouslyClicked && previouslyClickedIndex !== index) {
      // unclick previous note if it was different then the current one.
      previouslyClicked.clicked = false;
    }

    // mark new note clicked, or unmark a current note if it is the same one.
    note.clicked = !note.clicked;

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

  useEffect(
    function setDeleteListener() {
      function deleteNote(event) {
        if (event.key === "Delete" || event.key === "Backspace") {
          const notesCopy = [...songNotes];
          const toDelete = notesCopy.findIndex((note) => note.clicked);
          notesCopy.splice(toDelete, 1);
          setSongNotes(notesCopy);
        }
      }

      document.addEventListener("keydown", deleteNote);
      return () => {
        document.removeEventListener("keydown", deleteNote);
      };
    },
    [noteClicked]
  );

  useEffect(() => {
    if (inExpandedState()) {
      const songNotesCopy = [...songNotes];
      songNotesCopy[expandedNote.index].content = expandedNote.note.content;
      setSongNotes(songNotesCopy);
    }
  }, [expandedNote.note.content]);

  return (
    <div className="App">
      <div className="container">
        <div className="header">Co grać na gitarze</div>

        {!inExpandedState() ? (
          [
            ...songNotes.map((note, index) => {
              return (
                <div
                  className={`note-header ${
                    note.clicked ? "note-header--clicked" : ""
                  }`}
                  key={index}
                  onClick={() => setNoteClicked(index)}
                >
                  <span className="note-header__text">{note.title}</span>
                  {note.clicked && (
                    <FontAwesomeIcon
                      icon="trash-alt"
                      className="minus_icon"
                      size="2x"
                    />
                  )}
                  <button
                    className="note-header__toggle-button"
                    onClick={() => toggleNoteExpansion(index)}
                  >
                    <FontAwesomeIcon
                      id="filter"
                      icon="caret-down"
                      className="down_icon"
                      size="3x"
                    />
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
                <FontAwesomeIcon
                  icon="caret-down"
                  className="down_icon"
                  size="3x"
                />
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
                    : emptyState.content
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
