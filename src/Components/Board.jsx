import React, { useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { VscDebugRestart } from "react-icons/vsc";
import { calculateWinner } from "../utils/calculateWinner";
import Square from "./Square";

const Board = ({
  xIsNext,
  squares,
  onPlay,
  handleCloseGame,
  jumpTo,
  setStatus,
  status,
  selectedColor1,
  selectedColor2,
  selectedIcon1,
  selectedIcon2,
  setIsRunning,
  setTime1,
  setTime2,
  matchDuration,
  history,
}) => {
  const winner = calculateWinner(squares);

  useEffect(() => {
    if (winner) {
      setStatus(winner);
      return;
    }

    if (!winner && history?.length === 10) {
      setStatus("draw");
    }
  }, [winner, history?.length, setStatus]);

  const handleValue = (i) => {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares?.slice();

    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`p-3 sm:p-5 rounded-3xl bg-slate-100 border border-slate-200 shadow-inner transition-all ${
          status ? "pointer-events-none opacity-95" : ""
        }`}
      >
        <div className="flex">
          <Square
            value={squares[0]}
            onSquareClick={() => handleValue(0)}
            selectedColor1={selectedColor1}
            selectedColor2={selectedColor2}
            selectedIcon1={selectedIcon1}
            selectedIcon2={selectedIcon2}
          />
          <Square
            value={squares[1]}
            onSquareClick={() => handleValue(1)}
            selectedColor1={selectedColor1}
            selectedColor2={selectedColor2}
            selectedIcon1={selectedIcon1}
            selectedIcon2={selectedIcon2}
          />
          <Square
            value={squares[2]}
            onSquareClick={() => handleValue(2)}
            selectedColor1={selectedColor1}
            selectedColor2={selectedColor2}
            selectedIcon1={selectedIcon1}
            selectedIcon2={selectedIcon2}
          />
        </div>
        <div className="flex">
          <Square
            value={squares[3]}
            onSquareClick={() => handleValue(3)}
            selectedColor1={selectedColor1}
            selectedColor2={selectedColor2}
            selectedIcon1={selectedIcon1}
            selectedIcon2={selectedIcon2}
          />
          <Square
            value={squares[4]}
            onSquareClick={() => handleValue(4)}
            selectedColor1={selectedColor1}
            selectedColor2={selectedColor2}
            selectedIcon1={selectedIcon1}
            selectedIcon2={selectedIcon2}
          />
          <Square
            value={squares[5]}
            onSquareClick={() => handleValue(5)}
            selectedColor1={selectedColor1}
            selectedColor2={selectedColor2}
            selectedIcon1={selectedIcon1}
            selectedIcon2={selectedIcon2}
          />
        </div>
        <div className="flex">
          <Square
            value={squares[6]}
            onSquareClick={() => handleValue(6)}
            selectedColor1={selectedColor1}
            selectedColor2={selectedColor2}
            selectedIcon1={selectedIcon1}
            selectedIcon2={selectedIcon2}
          />
          <Square
            value={squares[7]}
            onSquareClick={() => handleValue(7)}
            selectedColor1={selectedColor1}
            selectedColor2={selectedColor2}
            selectedIcon1={selectedIcon1}
            selectedIcon2={selectedIcon2}
          />
          <Square
            value={squares[8]}
            onSquareClick={() => handleValue(8)}
            selectedColor1={selectedColor1}
            selectedColor2={selectedColor2}
            selectedIcon1={selectedIcon1}
            selectedIcon2={selectedIcon2}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={() => handleCloseGame()}
          className="flex items-center justify-center gap-2 text-slate-700 hover:text-slate-900 text-sm font-medium bg-white hover:bg-slate-50 border border-slate-300 rounded-xl cursor-pointer px-4 py-2 transition-all shadow-xs active:scale-95"
        >
          <IoIosArrowBack />
          <span>Exit to Home</span>
        </button>
        {status && (
          <button
            onClick={() => {
              setStatus(null);
              jumpTo(0);
              setIsRunning(true);
              setTime1(matchDuration);
              setTime2(matchDuration);
            }}
            className="flex items-center justify-center gap-2 text-white text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer px-5 py-2 transition-all shadow-sm active:scale-95"
          >
            <VscDebugRestart />
            <span>Play Again</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Board;
