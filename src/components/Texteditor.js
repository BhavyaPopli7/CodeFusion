import React, { useState, useEffect, useRef } from 'react';
import { monaco } from '@monaco-editor/react';
import Editor from '@monaco-editor/react';
import ACTIONS from '../Actions';
import throttle from 'lodash/throttle';

const Texteditor = ({ socketRef, roomId, onCodeChange }) => {
  const [language, setLanguage] = useState('javascript');
  const editorRef = useRef(null);
  const isLocalChange = useRef(false); // To track whether the change is local or from the server

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  // Throttled version of handleEditorChange
  const throttledHandleEditorChange = useRef(
    throttle((value) => {
      if (isLocalChange.current) {
        onCodeChange(value);
        if (socketRef.current) {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code: value,
          });
        }
      }
    }, 200) // Throttle by 200ms
  ).current;

  useEffect(() => {
    if (socketRef.current) {
      const handleCodeChange = ({ code }) => {
        const editor = editorRef.current;

        // Check if the current code is different from the received code
        if (code !== null && editor.getValue() !== code) {
          // Preserve cursor and scroll positions
          const position = editor.getPosition();
          const scrollTop = editor.getScrollTop();
          const scrollLeft = editor.getScrollLeft();

          // Mark that this is a server update
          isLocalChange.current = false;

          // Update the editor content with the new code
          editor.setValue(code);

          // Restore the cursor position and scroll state
          editor.setPosition(position);
          editor.setScrollTop(scrollTop);
          editor.setScrollLeft(scrollLeft);

          // After setting the value, allow local changes again
          isLocalChange.current = true;
        }
      };

      socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);

      return () => {
        socketRef.current.off(ACTIONS.CODE_CHANGE, handleCodeChange);
      };
    }
  }, [socketRef.current]);

  return (
    <div>
      <select onChange={handleLanguageChange} value={language} className='w-32'>
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="cpp">C++</option>
      </select>
      <Editor
        height="800px"
        width="1275px"
        theme='vs-dark'
        language={language}
        defaultValue="// Write your code here"
        onMount={(editor) => {
          editorRef.current = editor;
          isLocalChange.current = true; // Allow local changes when editor is first mounted
        }}
        onChange={(value) => {
          isLocalChange.current = true; // Mark this as a local change
          throttledHandleEditorChange(value);
        }}
        options={{
          selectOnLineNumbers: true,
          automaticLayout: true,
          readOnly: false,
          wordWrap: 'on',
          lineNumbers: 'on',
          bracketPairColorization: true,
          fontSize: 16,
          minimap: { enabled: true }
        }}
      />
    </div>
  );
};

export default Texteditor;
