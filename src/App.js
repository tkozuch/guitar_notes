import "./App.css";

import { React, useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCaretDown,
  faMinus,
  faPlus,
  faTrashAlt,
  faPlusCircle,
  faPlusSquare,
  faPencilAlt,
  faEdit,
  faPen,
} from "@fortawesome/free-solid-svg-icons";

import { Editor } from "react-draft-wysiwyg";
import "../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

library.add(
  faCaretDown,
  faMinus,
  faPlus,
  faTrashAlt,
  faPlusSquare,
  faPlusCircle,
  faPencilAlt,
  faEdit
);

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

  function deleteNote(index) {
    console.log("deleting note: ", index);
    const notesCopy = [...songNotes];
    notesCopy.splice(index, 1);
    console.log("setting song notes: ", notesCopy);
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

  function editTitle(event, currentTitle, index) {
    event.stopPropagation();
    const newTitle = prompt("Edit title: ", currentTitle);
    if (newTitle !== null) {
      const notesCopy = [...songNotes];
      notesCopy[index].title = newTitle;
      setSongNotes(notesCopy);
    }
  }

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
      function deleteNoteOnKey(event) {
        if (event.key === "Delete" || event.key === "Backspace") {
          const index = songNotes.findIndex((note) => note.clicked);
          deleteNote(index);
        }
      }
      if (noteClicked && !inExpandedState) {
        document.addEventListener("keydown", deleteNoteOnKey);
      }
      return () => {
        document.removeEventListener("keydown", deleteNoteOnKey);
      };
    },
    [noteClicked, inExpandedState]
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
                    <button
                      className="btn-delete btn-unstyled"
                      onClick={() => deleteNote(index)}
                    >
                      <FontAwesomeIcon
                        icon="trash-alt"
                        className="minus_icon"
                        size="2x"
                      />
                    </button>
                  )}
                  <button className="btn-edit btn-unstyled">
                    <FontAwesomeIcon
                      icon="pencil-alt"
                      size="1.5x"
                      onClick={(event) => editTitle(event, note.title, index)}
                    />
                  </button>
                  <button
                    className="btn-expand btn-unstyled"
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
              className="btn-add btn-unstyled"
              onClick={function addSong() {
                const name = prompt("Song name:");
                setSongNotes([
                  ...songNotes,
                  { title: name, content: undefined },
                ]);
              }}
            >
              <FontAwesomeIcon
                icon="plus-circle"
                size="4x"
                className="plus-icon"
              ></FontAwesomeIcon>
            </button>,
          ]
        ) : (
          <>
            <div className="note-header">
              <span className="note-header__text">
                {expandedNote.note.title}
              </span>
              <button
                onClick={() => toggleNoteExpansion()}
                className="btn-expand btn-unstyled mg-left-auto"
              >
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
                contentClassName="rich-text__content"
                editorClassName="rich-text__editor"
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
