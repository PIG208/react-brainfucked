import CodeEditor from "@uiw/react-textarea-code-editor";

export type EditorProps = {
  code: string;
  setCode: (val: string) => void;
  enabled: boolean;
};

const Editor = ({ code, setCode, enabled }: EditorProps) => {
  return (
    <CodeEditor
      value={code}
      language="brainfuck"
      placeholder="brainfuck here"
      onChange={(val) => setCode(val.target.value)}
      padding={10}
      disabled={!enabled}
    />
  );
};

export default Editor;
