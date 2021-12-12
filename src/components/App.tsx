import { useEffect, useState } from "react";

import { useBrainfuck } from "../hooks/useBrainfuck";

import "../css/App.css";

import Console from "./Console";
import ControlPanel from "./ControlPanel";
import Editor from "./Editor";
import UserManual from "./UserManual";
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
      <main className="App-main">
        <div>
          <h1 id="center">react-brainfucked</h1>
        </div>
        <div>
          <Editor code={code} setCode={setCode} enabled={editorEnabled} />
          <Visualization programState={brainfuck} dispatch={dispatch} memoryDisplayCount={21}/>
          <ControlPanel programState={brainfuck} setCode={setCode} dispatch={dispatch} />
          <Console programState={brainfuck} dispatch={dispatch} />
          <UserManual />
        </div>
      </main>
    </div>
  );
}

export default App;
