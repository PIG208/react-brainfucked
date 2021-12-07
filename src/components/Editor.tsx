import CodeEditor from "@uiw/react-textarea-code-editor";

export type EditorProps = {
  code: string;
  setCode: (val: string) => void;
  enabled: boolean;
};

const Editor = ({ code, setCode, enabled }: EditorProps) => {
  return (
    <>
      <h2>Editor</h2>
      <CodeEditor
        value={code}
        language="brainfuck"
        placeholder="brainfuck program here"
        onChange={(val) => setCode(val.target.value)}
        padding={10}
        style={{
          border: "1px solid black",
          borderRadius: "var(--border-radius)",
        }}
        disabled={!enabled}
      />
    </>
  );
};

export default Editor;
