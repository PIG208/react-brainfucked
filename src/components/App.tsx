import { useEffect, useState } from "react";

import { useBrainfuck } from "../hooks/useBrainfuck";

import "../css/App.css";

import Console from "./Console";
import ControlPanel from "./ControlPanel";
import Editor from "./Editor";
import Visualization from "./Visualization";

function App() {
  const [code, setCode] = useState("");
  const [brainfuck, dispatch] = useBrainfuck(code);
  const [editorEnabled] = useState(true);

  useEffect(() => {
    dispatch({ type: "load", data: code });
    dispatch({ type: "reset" });
  }, [code, dispatch]);

  return (
    <div className="App">
      <p id="editor">asd</p>
      <h1 id="center">react-brainfucked</h1>
      <Editor code={code} setCode={setCode} enabled={editorEnabled} />
      <Visualization programState={brainfuck} />
      <ControlPanel programState={brainfuck} dispatch={dispatch} />
      <Console programState={brainfuck} dispatch={dispatch} />
    </div>
  );
}

export default App;
