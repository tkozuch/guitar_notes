import { React } from "react";
import { Editor } from "react-draft-wysiwyg";

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

export function NoteContent(note, setExpandedNote) {
  return (
    <div className="note-content">
      <Editor
        toolbarClassName="rich-text__toolbar"
        contentClassName="rich-text__content"
        editorClassName="rich-text__editor"
        onContentStateChange={(contentState) => {
          const note = {
            ...note,
            content: contentState,
          };
          console.log("setting: ", note);
          setExpandedNote({
            index: note.index,
            note,
          });
        }}
        initialContentState={
          note.note.content
            ? note.note.content
            : emptyState.content
        }
      ></Editor>
    </div>
  );
}
