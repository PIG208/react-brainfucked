import CodeEditor from "@uiw/react-textarea-code-editor";

import "../css/Editor.css";

export type EditorProps = {
  code: string;
  setCode: (val: string) => void;
  enabled: boolean;
};

const Editor = ({ code, setCode, enabled }: EditorProps) => {
  return (
    <div>
      <h2>Editor</h2>
      <div className="editor-container">
        <CodeEditor
          value={code}
          language="brainfuck"
          placeholder="brainfuck program here"
          onChange={(val) => setCode(val.target.value)}
          padding={10}
          disabled={!enabled}
        />
      </div>
    </div>
  );
};

export default Editor;
