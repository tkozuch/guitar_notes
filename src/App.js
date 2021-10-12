import "./App.css";
import { useState } from "react";

import notes from "./notes.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Markup } from "interweave";

import {
  EditorContainer,
  Editor,
  InlineToggleButton,
  EditorToolbar,
  ToggleButtonGroup,
} from "draft-js-wysiwyg";
import { EditorState } from "draft-js";
import {
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
} from "@material-ui/icons";
import "draft-js/dist/Draft.css";

library.add(faCaretDown);

function App() {
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  const editor = React.useRef(null);

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
              const noteContent = note.notes;

              return (
                <>
                  <div className="note-header">
                    <span className="note-header__text">{note.title}</span>
                    <button onClick={() => toggleNoteExpansion()}>
                      <FontAwesomeIcon icon="caret-down" size="3x" />
                    </button>
                  </div>
                  <div className="note-content">
                    {noteContent.map((note, index) => {
                      if (note.type === "YT") {
                        return (
                          <div className="note-content__yt-note">
                            <iframe
                              width="560"
                              height="315"
                              src={note.ytUrl}
                              title="YouTube video player"
                              frameborder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowfullscreen
                            ></iframe>
                            <EditorContainer
                              editorState={editorState}
                              onChange={setEditorState}
                            >
                              <EditorToolbar>
                                <ToggleButtonGroup size="small">
                                  <InlineToggleButton value="BOLD">
                                    <FormatBoldIcon />
                                  </InlineToggleButton>
                                  <InlineToggleButton value="ITALIC">
                                    <FormatItalicIcon />
                                  </InlineToggleButton>
                                </ToggleButtonGroup>
                              </EditorToolbar>
                              <Editor
                                ref={editor}
                                placeholder="Enter some text.."
                              />
                            </EditorContainer>
                          </div>
                        );
                      } else if (note.type === "other") {
                        return (
                          <div className="note-content__other-note">
                            <EditorContainer
                              editorState={editorState}
                              onChange={setEditorState}
                            >
                              <EditorToolbar>
                                <ToggleButtonGroup size="small">
                                  <InlineToggleButton value="BOLD">
                                    <FormatBoldIcon />
                                  </InlineToggleButton>
                                  <InlineToggleButton value="ITALIC">
                                    <FormatItalicIcon />
                                  </InlineToggleButton>
                                </ToggleButtonGroup>
                              </EditorToolbar>
                              <Editor
                                ref={editor}
                                placeholder="Enter some text.."
                              />
                            </EditorContainer>
                          </div>
                        );
                      } else {
                        throw new Error("Wrong note type. What are you doing?");
                      }
                    })}
                  </div>
                </>
              );
            })()}
      </div>
    </div>
  );
}

export default App;
