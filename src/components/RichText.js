import { Editor } from "react-draft-wysiwyg";
import "../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import React, { Component } from "react";

import { EditorState } from "draft-js";

export const RichText = () => (
  <Editor toolbarClassName="rich-text__toolbar"></Editor>
);

// export class RichText extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       editorState: EditorState.createEmpty(),
//       hideToolbar: true,
//     };
//   }

//   onEditorStateChange = (editorState) => {
//     this.setState({
//       editorState,
//     });
//   };

//   onContentStateChange = (contentState) => {
//     this.setState({
//       contentState,
//     });
//   };

//   render() {
//     const { editorState } = this.state;

//     return (
//       <Editor
//         editorState={editorState}
//         toolbarOnFocus={!this.state.hideToolbar}
//         toolbarHidden={this.state.hideToolbar}
//         wrapperClassName="demo-wrapper"
//         editorClassName="demo-editor"
//         toolbarClassName="toolbar-class"
//         onFocus={() => {
//           this.setState({ hideToolbar: false });
//         }}
//         onBlur={() => {
//           this.setState({ hideToolbar: true });
//         }}
//         onEditorStateChange={this.onEditorStateChange}
//         onContentStateChange={this.onContentStateChange}
//         placeholder={"  Write Here"}
//         editorStyle={{
//           // backgroundColor: "red",
//           padding: 0,
//           borderWidth: 0,
//           borderColor: "transparent",
//           height: 60,
//           // visibility: "hidden",
//         }}
//       />
//     );
//   }
// }
