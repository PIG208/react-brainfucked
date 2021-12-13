import "../css/UserManual.css";

const UserManual = () => {
  return (
    <div>
      <h2>User Manual</h2>
      <p>A BF program has 8 different instructions</p>
      <table className="manual-table">
        <thead>
          <tr>
            <th>Instruction</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>&gt;</td>
            <td>Move the data pointer to the right</td>
          </tr>
          <tr>
            <td>&lt;</td>
            <td>Move the data pointer to the left</td>
          </tr>
          <tr>
            <td>+</td>
            <td>Increment the current memory cell</td>
          </tr>
          <tr>
            <td>-</td>
            <td>Decrement the current memory cell</td>
          </tr>
          <tr>
            <td>,</td>
            <td>Take one input from the stdin</td>
          </tr>
          <tr>
            <td>.</td>
            <td>Print the current memory (decoded as ASCII)</td>
          </tr>
          <tr>
            <td>[</td>
            <td>
              Do nothing when the current memory cell is 0, otherwise jump to corresponding{" "}
              <code>]</code>
            </td>
          </tr>
          <tr>
            <td>]</td>
            <td>
              Do nothing when the current memory cell is 0, otherwise jump to corresponding{" "}
              <code>[</code>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        Enter your program in the <span className="bordered-text">Editor</span>. If it is nonempty,
        you should be able to click on <span className="bordered-text">Run</span> to run it.
      </p>
      <p>
        You can also step through the program one cycle by one cycle after pressing the{" "}
        <span className="bordered-text">Start</span> button.
      </p>
      <p>
        The <span className="bordered-text">Last read</span> section indicates what the program has
        just read from the user input.
      </p>
      <p>
        To add a breakpoint, just click on the instruction to pause at in the parsed program block.
      </p>
      <p>
        Checkout <a href="https://en.wikipedia.org/wiki/Brainfuck" target="_blank" rel="noreferrer">Wikipedia</a> for more
        information about Brainfuck.
      </p>
      <p>
        To see more examples, you can visit this <a href="http://brainfuck.org/" target="_blank" rel="noreferrer">site</a>.
      </p>
    </div>
  );
};

export default UserManual;
