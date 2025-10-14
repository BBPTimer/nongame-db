import './Board.css';
import Prompt from "./Board/Prompt";
import Spaces from "./Board/Spaces";

const Board = () => {
  return (
    <div className="board">
      <Spaces />
      <div className="space space12">
        <Prompt />
      </div>
    </div>
  );
};

export default Board;
