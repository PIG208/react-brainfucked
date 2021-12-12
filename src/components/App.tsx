import { useEffect, useState } from "react";

import { useBrainfuck } from "../hooks/useBrainfuck";

import "../css/App.css";

import Console from "./Console";
import ControlPanel from "./ControlPanel";
import Editor from "./Editor";
import GithubLink from "./GithubLink";
import UserManual from "./UserManual";
import Visualization from "./Visualization";

const [xlg, lg, md, sm, xs] = [2560, 1920, 1463, 1024, 768];
const getMemoryDisplayCount = (width: number) =>
  width >= xlg
    ? 64
    : width >= lg
    ? 42
    : width >= md
    ? 35
    : width >= sm
    ? 24
    : width >= xs
    ? 15
    : 12;

function App() {
  const [code, setCode] = useState("");
  const [brainfuck, dispatch] = useBrainfuck(code);
  const [editorEnabled] = useState(true);
  const [memoryDisplayCount, setMemoryDisplayCount] = useState(
    getMemoryDisplayCount(window.innerWidth)
  );

  useEffect(() => {
    function handleResize() {
      setMemoryDisplayCount(getMemoryDisplayCount(window.innerWidth));
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch({ type: "load", data: code });
    dispatch({ type: "reset" });
  }, [code, dispatch]);

  return (
    <div className="App">
      <h1 id="center">react-brainfucked</h1>
      <main className="App-main">
        <div>
          <Editor code={code} setCode={setCode} enabled={editorEnabled} />
          <Visualization
            programState={brainfuck}
            dispatch={dispatch}
            memoryDisplayCount={memoryDisplayCount}
          />
        </div>
        <div>
          <ControlPanel programState={brainfuck} setCode={setCode} dispatch={dispatch} />
          <Console programState={brainfuck} dispatch={dispatch} />
          <UserManual />
        </div>
      </main>
      <GithubLink />
    </div>
  );
}

export default App;
