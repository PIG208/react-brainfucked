import "../css/UserManual.css";

const UserManual = () => {
  return (
    <>
      <h2>User Manual</h2>
      <p>A BF program has 8 different instructions</p>
      <table className="manual-table">
        <tr>
          <th>Instruction</th>
          <th>Description</th>
        </tr>
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
        <p>
          Enter your program in the <span className="bordered-text">Editor</span>. If it is
          nonempty, you should be able to click on <span className="bordered-text">Run</span> to run
          it.
        </p>
      </table>
      <p>
        You can also step through the program one cycle by one cycle after pressing the{" "}
        <span className="bordered-text">Start</span> button.
      </p>
    </>
  );
};

export default UserManual;
