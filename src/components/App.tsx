import { useEffect, useState } from "react";

import { useBrainfuck } from "../hooks/useBrainfuck";

import "../css/App.css";

import Collapsable from "./Collapsable";
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
  const [brainfuck, dispatch, running] = useBrainfuck(code);
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
      <h1 className="centered">react-brainfucked</h1>
      <h2 className="centered">A brainfuck interpreter & debugger</h2>
      <main className="App-main">
        <div>
          <Collapsable altText="Show editor">
            <Editor code={code} setCode={setCode} enabled={editorEnabled} />
          </Collapsable>
          <Visualization
            programState={brainfuck}
            dispatch={dispatch}
            memoryDisplayCount={memoryDisplayCount}
          />
        </div>
        <div>
          <Collapsable fixedBottom altText="Show control panel">
            <ControlPanel
              programState={brainfuck}
              setCode={setCode}
              dispatch={dispatch}
              running={running}
            />
          </Collapsable>
          <Collapsable altText="Show console">
            <Console programState={brainfuck} dispatch={dispatch} />
          </Collapsable>
          <Collapsable altText="Show user manual">
            <UserManual />
          </Collapsable>
        </div>
      </main>
      <GithubLink />
    </div>
  );
}

export default App;
