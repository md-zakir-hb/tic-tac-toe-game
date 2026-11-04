import { useEffect, useState } from "react";
import { FaCrown, FaHome, FaRedo, FaRobot, FaUserFriends } from "react-icons/fa";
import { GiFox, GiLion } from "react-icons/gi";
import { HiMiniArrowPath } from "react-icons/hi2";
import { useGameStore } from "../store/useGameStore";
import { getClassicalAiMove } from "../utils/aiLogic";
import { checkWinner } from "../utils/gameRules";
import { playDrawSound, playMoveSound, playTapSound, playWinSound } from "../utils/soundEffects";

const ClassicalArena = () => {
  const { setActiveMode, scores, recordWin, resetScores } = useGameStore();

  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winnerData, setWinnerData] = useState({ winner: null, line: null });
  const [vsAI, setVsAI] = useState(true);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Handle player click on a tile
  const handleCellClick = (index) => {
    if (board[index] || winnerData.winner || (vsAI && !xIsNext) || isAiThinking) {
      return;
    }

    playMoveSound(xIsNext);
    const newBoard = [...board];
    newBoard[index] = xIsNext ? "X" : "O";
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result.winner) {
      setWinnerData(result);
      if (result.winner === "draw") {
        playDrawSound();
        recordWin("classical", "draw");
      } else {
        playWinSound();
        recordWin("classical", result.winner);
      }
      return;
    }

    setXIsNext(!xIsNext);
  };

  // AI Move effect
  useEffect(() => {
    if (!vsAI || xIsNext || winnerData.winner) return;

    setIsAiThinking(true);
    const timer = setTimeout(() => {
      const aiMove = getClassicalAiMove(board);
      if (aiMove !== null && aiMove !== undefined) {
        playMoveSound(false);
        const newBoard = [...board];
        newBoard[aiMove] = "O";
        setBoard(newBoard);

        const result = checkWinner(newBoard);
        if (result.winner) {
          setWinnerData(result);
          if (result.winner === "draw") {
            playDrawSound();
            recordWin("classical", "draw");
          } else {
            playWinSound();
            recordWin("classical", result.winner);
          }
        } else {
          setXIsNext(true);
        }
      }
      setIsAiThinking(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [vsAI, xIsNext, board, winnerData.winner, recordWin]);

  const handleResetMatch = () => {
    playTapSound();
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinnerData({ winner: null, line: null });
    setIsAiThinking(false);
  };

  return (
    <div className="w-full max-w-4xl px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center text-slate-100">
      {/* Top Navigation & Mode Bar */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 pb-4 border-b border-purple-500/20">
        <button
          onClick={() => {
            playTapSound();
            setActiveMode("lobby");
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-purple-200 bg-slate-900/80 border border-purple-500/40 hover:bg-slate-800 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.2)] self-start sm:self-auto"
        >
          <FaHome />
          <span>Exit to Lobby</span>
        </button>

        {/* Mode & Opponent Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-purple-500/40">
          <button
            onClick={() => {
              playTapSound();
              setVsAI(true);
              handleResetMatch();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              vsAI
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                : "text-purple-300 hover:text-white"
            }`}
          >
            <FaRobot className="text-sm" />
            <span>Play vs AI</span>
          </button>
          <button
            onClick={() => {
              playTapSound();
              setVsAI(false);
              handleResetMatch();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              !vsAI
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                : "text-purple-300 hover:text-white"
            }`}
          >
            <FaUserFriends className="text-sm" />
            <span>2-Player Local</span>
          </button>
        </div>
      </div>

      {/* Players Profile & Live Turn Card */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 items-center bg-slate-900/80 border border-purple-500/30 p-2.5 sm:p-4 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.5)] mb-6 backdrop-blur-md">
        {/* Player 1 Card */}
        <div
          className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl transition-all ${
            xIsNext && !winnerData.winner
              ? "bg-rose-950/60 border-2 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)] scale-[1.02]"
              : "bg-slate-950/60 border border-purple-500/20"
          }`}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center text-lg sm:text-xl shadow-[0_0_15px_rgba(244,63,94,0.4)] shrink-0">
            <GiFox />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-bold text-white text-xs sm:text-sm truncate">
                {vsAI ? "You" : "Player 1"}
              </span>
              <span className="text-[10px] font-black text-rose-300 bg-rose-950 px-1 rounded border border-rose-500/40">X</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-purple-300/70 font-medium truncate">Wins: {scores.classical.player}</p>
          </div>
        </div>

        {/* Center Live Status / Outcome */}
        <div className="col-span-2 sm:col-span-1 order-last sm:order-none flex flex-col items-center justify-center">
          {winnerData.winner ? (
            <div className="flex flex-col items-center text-center">
              {winnerData.winner === "draw" ? (
                <div className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                  🤝 Match Drawn!
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <FaCrown className="text-amber-400" />
                  <span>
                    {winnerData.winner === "X"
                      ? vsAI
                        ? "You Won!"
                        : "Player 1 Won!"
                      : vsAI
                      ? "Smart Bot Won!"
                      : "Player 2 Won!"}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-purple-500/30 text-xs font-semibold text-purple-200">
              <span className="text-[11px] text-purple-400">Turn:</span>
              <span className="font-bold text-white flex items-center gap-1">
                {xIsNext ? (
                  <span>Player 1 (Fox 🦊)</span>
                ) : vsAI ? (
                  <span>{isAiThinking ? "🤖 Bot..." : "Smart Bot"}</span>
                ) : (
                  <span>Player 2 (Lion 🦁)</span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Player 2 Card */}
        <div
          className={`flex items-center justify-end gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl transition-all ${
            !xIsNext && !winnerData.winner
              ? "bg-purple-950/60 border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] scale-[1.02]"
              : "bg-slate-950/60 border border-purple-500/20"
          }`}
        >
          <div className="text-right min-w-0">
            <div className="flex items-center justify-end gap-1">
              <span className="text-[10px] font-black text-purple-300 bg-purple-950 px-1 rounded border border-purple-500/40">O</span>
              <span className="font-bold text-white text-xs sm:text-sm truncate">
                {vsAI ? "Smart Bot" : "Player 2"}
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-purple-300/70 font-medium truncate">Wins: {scores.classical.ai}</p>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center text-lg sm:text-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] shrink-0">
            {vsAI ? <FaRobot /> : <GiLion />}
          </div>
        </div>
      </div>

      {/* 3x3 Interactive Classical Board */}
      <div className="p-3 min-[360px]:p-4 sm:p-6 rounded-3xl bg-slate-950/80 border-2 border-purple-500/40 shadow-[0_0_40px_rgba(0,0,0,0.8),inset_0_0_25px_rgba(168,85,247,0.15)] mb-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-3.5">
          {board.map((val, idx) => {
            const isWinningCell = winnerData.line && winnerData.line.includes(idx);

            return (
              <button
                key={idx}
                onClick={() => handleCellClick(idx)}
                disabled={!!val || !!winnerData.winner || isAiThinking || (vsAI && !xIsNext)}
                className={`w-[68px] h-[68px] min-[360px]:w-20 min-[360px]:h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl min-[360px]:text-3xl sm:text-4xl font-black transition-all select-none ${
                  isWinningCell
                    ? "bg-emerald-900/80 border-4 border-emerald-400 text-emerald-200 scale-105 shadow-[0_0_30px_rgba(16,185,129,0.7)] z-10"
                    : val === "X"
                    ? "bg-rose-950/70 text-rose-300 border-2 border-rose-500/80 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                    : val === "O"
                    ? "bg-purple-950/70 text-purple-300 border-2 border-purple-500/80 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                    : isAiThinking
                    ? "bg-slate-900/40 border border-purple-500/20 opacity-50 cursor-wait"
                    : "bg-slate-900/60 hover:bg-slate-800/80 border border-purple-500/30 hover:border-purple-400 shadow-sm cursor-pointer active:scale-95"
                }`}
              >
                {val === "X" && <GiFox className="text-2xl min-[360px]:text-3xl sm:text-4xl text-rose-400" />}
                {val === "O" && (
                  vsAI ? (
                    <FaRobot className="text-2xl min-[360px]:text-3xl sm:text-4xl text-purple-400" />
                  ) : (
                    <GiLion className="text-2xl min-[360px]:text-3xl sm:text-4xl text-amber-400" />
                  )
                )}
                {!val && <span className="text-purple-500/30 text-xl font-light">·</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Arena Action Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleResetMatch}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all cursor-pointer active:scale-95"
        >
          <HiMiniArrowPath className="text-base" />
          <span>{winnerData.winner ? "Play Again" : "Reset Board"}</span>
        </button>

        <button
          onClick={() => {
            playTapSound();
            resetScores("classical");
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-purple-500/30 text-purple-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
        >
          <FaRedo className="text-xs text-purple-400" />
          <span>Reset Match Score</span>
        </button>
      </div>
    </div>
  );
};

export default ClassicalArena;
