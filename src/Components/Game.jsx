import React, { useEffect, useState } from "react";
import { FaHistory } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import Board from "./Board";
import DisplayResult from "./DisplayResult";
import History from "./History";
import PlayerCard from "./PlayerCard";

const Game = ({
  player1,
  player2,
  selectedColor1,
  selectedColor2,
  selectedIcon1,
  selectedIcon2,
  handleCloseGame,
  tossWinner,
  matchDuration,
  isRunning,
  setIsRunning,
}) => {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [xIsNext, setXIsNext] = useState(true);
  const [status, setStatus] = useState(null);
  const [currentMove, setCurrentMove] = useState(0);

  const [time1, setTime1] = useState(matchDuration);
  const [time2, setTime2] = useState(matchDuration);

  const currentSquares = history[currentMove];

  const handlePlay = (nextSquares) => {
    setXIsNext(!xIsNext);
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory?.length - 1);
  };

  const jumpTo = (move) => {
    setCurrentMove(move);
    setXIsNext(move % 2 === 0);
  };

  useEffect(() => {
    if (tossWinner === player1) {
      setXIsNext(true);
    } else {
      setXIsNext(false);
    }
  }, [tossWinner, player1]);

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row items-stretch justify-between text-slate-800 bg-[#f8fafc]">
      {/* Main Game Arena */}
      <div className="flex-1 p-6 sm:p-10 flex flex-col items-center justify-start max-w-5xl mx-auto w-full">
        {/* Top Bar with back button */}
        <div className="w-full flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <button
            onClick={handleCloseGame}
            className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
          >
            <IoIosArrowBack />
            <span>Back to Home</span>
          </button>
          <div className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
            LIVE MATCH • {matchDuration}s TIMER
          </div>
        </div>

        {/* Player Profile & Clock Header */}
        <PlayerCard
          player1={player1}
          player2={player2}
          selectedColor1={selectedColor1}
          selectedColor2={selectedColor2}
          selectedIcon1={selectedIcon1}
          selectedIcon2={selectedIcon2}
          xIsNext={xIsNext}
          status={status}
          setStatus={setStatus}
          matchDuration={matchDuration}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          time1={time1}
          setTime1={setTime1}
          time2={time2}
          setTime2={setTime2}
        />

        {/* Center Grid & Outcome Section */}
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 mt-8">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
            handleCloseGame={handleCloseGame}
            jumpTo={jumpTo}
            tossWinner={tossWinner}
            status={status}
            setStatus={setStatus}
            selectedColor1={selectedColor1}
            selectedColor2={selectedColor2}
            selectedIcon1={selectedIcon1}
            selectedIcon2={selectedIcon2}
            setIsRunning={setIsRunning}
            setTime1={setTime1}
            setTime2={setTime2}
            matchDuration={matchDuration}
            history={history}
          />

          <DisplayResult
            status={status}
            selectedColor1={selectedColor1}
            selectedColor2={selectedColor2}
            selectedIcon1={selectedIcon1}
            selectedIcon2={selectedIcon2}
          />
        </div>
      </div>

      {/* Right Sidebar: Move History */}
      <aside className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 p-6 sm:p-7 flex flex-col shadow-xs">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-200">
          <FaHistory className="text-indigo-600 text-sm" />
          <h3 className="font-bold text-slate-900 text-sm">Move History</h3>
        </div>

        <div className="flex-1 mt-3">
          {!status ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
              <p>Move history will be available to review once the match finishes.</p>
              <p className="mt-2 text-[11px] text-slate-400">Total moves so far: {history.length - 1}</p>
            </div>
          ) : (
            <div>
              <p className="text-xs text-slate-500 mb-2">
                Click any move to review the board state:
              </p>
              <History history={history} jumpTo={jumpTo} />
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default Game;
