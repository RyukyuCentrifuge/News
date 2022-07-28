import React, { useState, useEffect } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html'
export default function NewsEditor (props) {
  const [editorState, setEditorState] = useState("")

  useEffect(()=>{
    console.log(props.content);
  },[props.content])

  return (
    <div>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName='wrapperClassName'
        editorClassName='editorClassName'
        onEditorStateChange={(editorState) => {
          setEditorState(editorState)
        }}
        onBlur={() => {
          props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        }}
      />
    </div>
  )
}
