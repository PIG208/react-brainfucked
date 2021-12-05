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
      placeholder="brainfuck program here"
      onChange={(val) => setCode(val.target.value)}
      padding={10}
      style={{
        fontSize: "1.2rem",
      }}
      disabled={!enabled}
    />
  );
};

export default Editor;
