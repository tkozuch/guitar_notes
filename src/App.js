import "./App.css";

import { React, useState, useEffect, useCallback } from "react";
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

function App() {
  const [songNotes, setSongNotes] = useState([]);
  const setSongNote = useCallback(
    (index, properties) => {
      console.log("setting note: ", index, properties);
      const noteToChange = songNotes[index];
      console.log("to change", noteToChange);
      if (noteToChange) {
        const songNotesCopy = [...songNotes];
        console.log("songNotesCopy note, ", songNotesCopy[index]);
        songNotesCopy[index] = { ...songNotesCopy[index], ...properties };
        console.log("after note, notes", songNotesCopy[index], songNotesCopy);

        setSongNotes(songNotesCopy);
        console.log("song Notes afer setting: ", songNotes);
      }
    },
    [songNotes]
  );
  const noteClicked = useCallback(
    () => songNotes.filter((note) => note.clicked),
    [songNotes]
  );
  const expandedNote = useCallback(() => {
    console.log("in expandedNote callback. notes: ", songNotes);
    const expanded = songNotes.find((note) => note.expanded);
    const index = songNotes.findIndex((note) => note.expanded);

    return expanded
      ? { index, note: expanded }
      : {
          index: -1,
          note: {
            title: undefined,
            content: undefined,
            // note doesn't exist so it's imposibble it is clicked/expanded
            clicked: false,
            expanded: false,
          },
        };
  }, [songNotes]);
  const inExpandedState = useCallback(() => {
    console.log("in expandedState callback, notes: ", songNotes);
    return expandedNote().index !== -1;
  }, [expandedNote]);

  // TODO: Refactor this to use singleNoteSetting.
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
      setSongNote(index, { title: newTitle });
    }
  }

  useEffect(function initializeData() {
    console.log("initialization ");
    fetch("http://127.0.0.1:8000/notes", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((notesData) => {
        // Set default initial values.
        const dataRefilled = notesData.map((note) => ({
          ...note,
          clicked: false,
          expanded: false,
        }));

        console.log("Data initialized: ", dataRefilled);
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
      if (noteClicked && !inExpandedState()) {
        document.addEventListener("keydown", deleteNoteOnKey);
      }
      return () => {
        document.removeEventListener("keydown", deleteNoteOnKey);
      };
    },
    [noteClicked, inExpandedState]
  );

  function toggleNote(operation, index, event) {
    event.stopPropagation();
    if (operation === "expand") {
      setSongNote(index, { expanded: true });
    } else if (operation === "collapse") {
      setSongNote(index, { expanded: false });
    }
  }

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
                      handleClick={(event) => deleteNote(event, index)}
                    ></DeleteButton>
                  )}
                  <EditButton
                    handleClick={(event) => editTitle(event, note.title, index)}
                  ></EditButton>
                  <ExpandButton
                    handleClick={(event) => toggleNote("expand", index, event)}
                  ></ExpandButton>
                </NoteHeader>
              );
            }),
            <AddButton handleClick={addNote}></AddButton>,
          ]
        ) : (
          <>
            <NoteHeader
              isClicked={false}
              title={expandedNote().note.title}
              handleClick={() => setNoteClicked(expandedNote().index)}
            >
              {/* without Delete button here */}
              <EditButton
                handleClick={(event) =>
                  editTitle(
                    event,
                    expandedNote().note.title,
                    expandedNote().index
                  )
                }
              ></EditButton>
              <ExpandButton
                handleClick={(event) =>
                  toggleNote("collapse", expandedNote().index, event)
                }
              ></ExpandButton>
            </NoteHeader>
            <NoteContent
              note={expandedNote().note}
              onStateChange={(content) =>
                setSongNote(expandedNote().index, { content })
              }
            ></NoteContent>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
