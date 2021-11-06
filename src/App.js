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

import "../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { NoteHeader } from "./components/NoteHeader/NoteHeader";
import { AddButton } from "./components/AddButton";
import { NoteContent } from "./components/NoteContent";
import {
  ExpandButton,
  DeleteButton,
  EditButton,
} from "./components/NoteHeader/buttons";

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

export const emptyState = {
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
    console.log("setting note clicked. notes: ", notesCopy);
    setSongNotes(notesCopy);
  }

  function deleteNote(event, index) {
    event.stopPropagation();
    const notesCopy = [...songNotes];
    notesCopy.splice(index, 1);
    setSongNotes(notesCopy);
  }

  function addNote() {
    const name = prompt("Song name:");
    setSongNotes([
      ...songNotes,
      { title: name, content: undefined, clicked: false },
    ]);
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
    console.log("initialization ");
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
          deleteNote(event, index);
        }
      }
      if (noteClicked && inExpandedState) {
        document.addEventListener("keydown", deleteNoteOnKey);
      }
      return () => {
        document.removeEventListener("keydown", deleteNoteOnKey);
      };
    },
    [noteClicked, inExpandedState]
  );

  useEffect(() => {
    console.log("1");
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
                <NoteHeader
                  key={index}
                  isClicked={note.clicked}
                  title={note.title}
                  handleClick={() => setNoteClicked(index)}
                >
                  {note.clicked && (
                    <DeleteButton
                      handleClick={(event) => {
                        console.log("clicking");
                        deleteNote(event, index);
                      }}
                    ></DeleteButton>
                  )}
                  <EditButton
                    handleClick={(event) => editTitle(event, note.title, index)}
                  ></EditButton>
                  <ExpandButton
                    handleClick={() => toggleNoteExpansion(index)}
                  ></ExpandButton>
                </NoteHeader>
              );
            }),
            <AddButton handleClick={addNote}></AddButton>,
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
            {NoteContent(expandedNote, setExpandedNote)}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
