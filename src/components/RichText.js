import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import "../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import React, { Component } from "react";

export const RichText = () => (
  <Editor toolbarClassName="rich-text__toolbar"></Editor>
);
