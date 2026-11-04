import { useCallback, useEffect, useState } from "react";
import { FaCrown, FaHome, FaRedo, FaRobot, FaUserFriends } from "react-icons/fa";
import { GiFox, GiLion } from "react-icons/gi";
import { HiMiniArrowPath } from "react-icons/hi2";
import { PiHourglassFill } from "react-icons/pi";
import { useGameStore } from "../store/useGameStore";
import { getVanishingAiMove } from "../utils/aiLogic";
import { checkVanishingWinner } from "../utils/gameRules";
import { playMoveSound, playTapSound, playVanishSound, playWinSound } from "../utils/soundEffects";

const VanishingArena = () => {
  const { setActiveMode, scores, recordWin, resetScores } = useGameStore();

  const [board, setBoard] = useState(Array(9).fill(null));
  const [p1Moves, setP1Moves] = useState([]); // max 3 indices
  const [p2Moves, setP2Moves] = useState([]); // max 3 indices
  const [turn, setTurn] = useState("X"); // 'X' or 'O'
  const [winnerData, setWinnerData] = useState({ winner: null, line: null });
  const [vsAI, setVsAI] = useState(true);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const executeMove = useCallback((index, playerSymbol) => {
    let newP1Moves = [...p1Moves];
    let newP2Moves = [...p2Moves];
    const newBoard = [...board];

    if (playerSymbol === "X") {
      if (newP1Moves.length === 3) {
        const oldestIndex = newP1Moves.shift();
        newBoard[oldestIndex] = null;
        playVanishSound();
      }
      newP1Moves.push(index);
      newBoard[index] = "X";
      setP1Moves(newP1Moves);
      playMoveSound(true);
    } else {
      if (newP2Moves.length === 3) {
        const oldestIndex = newP2Moves.shift();
        newBoard[oldestIndex] = null;
        playVanishSound();
      }
      newP2Moves.push(index);
      newBoard[index] = "O";
      setP2Moves(newP2Moves);
      playMoveSound(false);
    }

    setBoard(newBoard);

    // Check winner
    const result = checkVanishingWinner(newBoard);
    if (result.winner) {
      setWinnerData(result);
      playWinSound();
      recordWin("vanishing", result.winner);
    } else {
      setTurn(playerSymbol === "X" ? "O" : "X");
    }
  }, [board, p1Moves, p2Moves, recordWin]);

  // Cell click handler
  const handleCellClick = (index) => {
    if (winnerData.winner || isAiThinking || (vsAI && turn !== "X")) return;

    // A cell is playable if empty OR if it holds this player's oldest piece that is vanishing
    const isP1Oldest = p1Moves.length === 3 && p1Moves[0] === index;
    if (board[index] !== null && !isP1Oldest) return;

    executeMove(index, "X");
  };

  // AI Turn handler
  useEffect(() => {
    if (!vsAI || turn !== "O" || winnerData.winner) return;

    setIsAiThinking(true);
    const aiTimer = setTimeout(() => {
      const aiMove = getVanishingAiMove(board, p1Moves, p2Moves);
      if (aiMove !== null && aiMove !== undefined) {
        executeMove(aiMove, "O");
      }
      setIsAiThinking(false);
    }, 550);

    return () => clearTimeout(aiTimer);
  }, [vsAI, turn, winnerData.winner, board, p1Moves, p2Moves, executeMove]);

  const handleResetMatch = () => {
    playTapSound();
    setBoard(Array(9).fill(null));
    setP1Moves([]);
    setP2Moves([]);
    setTurn("X");
    setWinnerData({ winner: null, line: null });
    setIsAiThinking(false);
  };

  return (
    <div className="w-full max-w-4xl px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center text-slate-100">
      {/* Top Navigation & Mode Selector */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 pb-4 border-b border-rose-500/20">
        <button
          onClick={() => {
            playTapSound();
            setActiveMode("lobby");
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-rose-200 bg-slate-900/80 border border-rose-500/40 hover:bg-slate-800 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.2)] self-start sm:self-auto"
        >
          <FaHome />
          <span>Exit to Lobby</span>
        </button>

        {/* Mode & Opponent Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-rose-500/40">
          <button
            onClick={() => {
              playTapSound();
              setVsAI(true);
              handleResetMatch();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              vsAI
                ? "bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]"
                : "text-rose-300 hover:text-white"
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
                ? "bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]"
                : "text-rose-300 hover:text-white"
            }`}
          >
            <FaUserFriends className="text-sm" />
            <span>2-Player Local</span>
          </button>
        </div>
      </div>

      {/* Players Profile & Pieces Indicator */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 items-center bg-slate-900/80 border border-rose-500/40 p-2.5 sm:p-4 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.5)] mb-6 backdrop-blur-md">
        {/* Player 1 Card */}
        <div
          className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl transition-all ${
            turn === "X" && !winnerData.winner
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
            {/* 3 Pieces Dots */}
            <div className="flex items-center gap-1 mt-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    i < p1Moves.length ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" : "bg-slate-700"
                  }`}
                />
              ))}
              <span className="text-[9px] sm:text-[10px] text-purple-300/70 font-mono ml-0.5">({p1Moves.length}/3)</span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-rose-200/70 mt-0.5 truncate">Wins: {scores.vanishing.player}</p>
          </div>
        </div>

        {/* Center Live Status */}
        <div className="col-span-2 sm:col-span-1 order-last sm:order-none flex flex-col items-center justify-center">
          {winnerData.winner ? (
            <div className="flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)]">
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
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-slate-950/80 border border-rose-500/30 text-[11px] sm:text-xs font-semibold text-rose-300">
              <PiHourglassFill className="text-rose-400" />
              <span className="font-bold flex items-center gap-1 text-white">
                {turn === "X" ? (
                  <span>Your Turn (Fox 🦊)</span>
                ) : vsAI ? (
                  <span>{isAiThinking ? "🤖 Bot Calculating..." : "Smart Bot's Turn"}</span>
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
            turn === "O" && !winnerData.winner
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
            {/* 3 Pieces Dots */}
            <div className="flex items-center justify-end gap-1 mt-1">
              <span className="text-[9px] sm:text-[10px] text-purple-300/70 font-mono mr-0.5">({p2Moves.length}/3)</span>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    i < p2Moves.length ? "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" : "bg-slate-700"
                  }`}
                />
              ))}
            </div>
            <p className="text-[9px] sm:text-[10px] text-purple-200/70 mt-0.5 truncate">Wins: {scores.vanishing.ai}</p>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center text-lg sm:text-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] shrink-0">
            {vsAI ? <FaRobot /> : <GiLion />}
          </div>
        </div>
      </div>

      {/* 3x3 Dynamic Vanishing Grid */}
      <div className="p-3 min-[360px]:p-4 sm:p-6 rounded-3xl bg-slate-950/80 border-2 border-rose-500/40 shadow-[0_0_40px_rgba(0,0,0,0.8),inset_0_0_25px_rgba(244,63,94,0.1)] mb-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-3.5">
          {board.map((val, idx) => {
            const isWinningCell = winnerData.line && winnerData.line.includes(idx);
            const isP1Oldest = p1Moves.length === 3 && p1Moves[0] === idx;
            const isP2Oldest = p2Moves.length === 3 && p2Moves[0] === idx;
            const willVanishOnCurrentTurn =
              (turn === "X" && isP1Oldest) || (turn === "O" && isP2Oldest);

            return (
              <button
                key={idx}
                onClick={() => handleCellClick(idx)}
                disabled={
                  !!winnerData.winner ||
                  isAiThinking ||
                  (vsAI && turn !== "X") ||
                  (val !== null && !willVanishOnCurrentTurn)
                }
                className={`w-[68px] h-[68px] min-[360px]:w-20 min-[360px]:h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center relative transition-all duration-200 select-none ${
                  isWinningCell
                    ? "bg-emerald-900/80 border-4 border-emerald-400 text-emerald-200 scale-105 shadow-[0_0_30px_rgba(16,185,129,0.7)] z-10"
                    : willVanishOnCurrentTurn
                    ? "ring-3 sm:ring-4 ring-dashed ring-amber-400 animate-pulse scale-95 shadow-[0_0_25px_rgba(250,204,21,0.5)]"
                    : ""
                } ${
                  val === "X"
                    ? isP1Oldest
                      ? "bg-rose-950/80 border-2 border-dashed border-rose-400 text-rose-300"
                      : "bg-rose-950/70 text-rose-300 border-2 border-rose-500/80 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                    : val === "O"
                    ? isP2Oldest
                      ? "bg-purple-950/80 border-2 border-dashed border-purple-400 text-purple-300"
                      : "bg-purple-950/70 text-purple-300 border-2 border-purple-500/80 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                    : "bg-slate-900/60 hover:bg-slate-800/80 border border-rose-500/30 hover:border-rose-400 shadow-sm cursor-pointer active:scale-95"
                }`}
              >
                {willVanishOnCurrentTurn && (
                  <span className="absolute top-1 text-[7px] sm:text-[9px] font-black uppercase tracking-tight text-amber-950 bg-amber-400 px-1 sm:px-1.5 py-0.5 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.8)]">
                    ⏳ Vanishes
                  </span>
                )}

                {val === "X" && <GiFox className="text-2xl min-[360px]:text-3xl sm:text-4xl text-rose-400" />}
                {val === "O" && (
                  vsAI ? (
                    <FaRobot className="text-2xl min-[360px]:text-3xl sm:text-4xl text-purple-400" />
                  ) : (
                    <GiLion className="text-2xl min-[360px]:text-3xl sm:text-4xl text-amber-400" />
                  )
                )}
                {!val && <span className="text-rose-500/30 text-lg sm:text-xl font-light">·</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleResetMatch}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all cursor-pointer active:scale-95"
        >
          <HiMiniArrowPath className="text-base" />
          <span>{winnerData.winner ? "Play Again" : "Reset Board"}</span>
        </button>

        <button
          onClick={() => {
            playTapSound();
            resetScores("vanishing");
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-rose-500/30 text-rose-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
        >
          <FaRedo className="text-xs text-rose-400" />
          <span>Reset Match Score</span>
        </button>
      </div>
    </div>
  );
};

export default VanishingArena;
