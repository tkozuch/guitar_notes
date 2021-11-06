import { React } from "react";
import { Editor } from "react-draft-wysiwyg";
import { emptyState } from "../App";

export function NoteContent(expandedNote, setExpandedNote) {
  return <div className="note-content">
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
      initialContentState={expandedNote.note.content
        ? expandedNote.note.content
        : emptyState.content}
    ></Editor>
  </div>;
}
