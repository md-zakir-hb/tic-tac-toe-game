import { useCallback, useEffect, useState } from "react";
import { FaCrown, FaDice, FaHome, FaRedo, FaRobot, FaUserFriends } from "react-icons/fa";
import { GiFox, GiLion } from "react-icons/gi";
import { HiMiniArrowPath } from "react-icons/hi2";
import { useGameStore } from "../store/useGameStore";
import { checkWinner } from "../utils/gameRules";
import { playDiceRollSound, playDrawSound, playMoveSound, playTapSound, playWinSound } from "../utils/soundEffects";

const DiceArena = () => {
  const { setActiveMode, scores, recordWin, resetScores } = useGameStore();

  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState("X"); // 'X' or 'O'
  const [winnerData, setWinnerData] = useState({ winner: null, line: null });
  const [isRolling, setIsRolling] = useState(false);
  const [currentDiceNum, setCurrentDiceNum] = useState(null);
  const [lastTargetIndex, setLastTargetIndex] = useState(null);
  const [vsAI, setVsAI] = useState(true);
  const [diceMessage, setDiceMessage] = useState({
    type: "info",
    text: "Roll the 9-sided die to claim a spot (1 to 9). If occupied, turn is forfeited!",
  });

  const executeRoll = useCallback((playerSymbol) => {
    setIsRolling(true);
    playDiceRollSound();

    let rollCount = 0;
    const interval = setInterval(() => {
      setCurrentDiceNum(Math.floor(Math.random() * 9) + 1);
      rollCount++;

      if (rollCount > 8) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 9) + 1;
        const targetIndex = finalRoll - 1;

        setCurrentDiceNum(finalRoll);
        setLastTargetIndex(targetIndex);

        // Check if tile is vacant or occupied
        if (board[targetIndex] === null) {
          playMoveSound(playerSymbol === "X");
          const newBoard = [...board];
          newBoard[targetIndex] = playerSymbol;
          setBoard(newBoard);

          const result = checkWinner(newBoard);
          if (result.winner) {
            setWinnerData(result);
            if (result.winner === "draw") {
              playDrawSound();
              recordWin("dice", "draw");
              setDiceMessage({ type: "draw", text: "🤝 The match ended in a draw!" });
            } else {
              playWinSound();
              recordWin("dice", result.winner);
              setDiceMessage({
                type: "win",
                text: `🎉 Player ${result.winner === "X" ? "1 (Fox 🦊)" : vsAI ? "Smart Bot (🤖)" : "2 (Lion 🦁)"} Wins!`,
              });
            }
          } else {
            setDiceMessage({
              type: "success",
              text: `Rolled #${finalRoll} — Spot claimed! Switching turn.`,
            });
            setTurn(playerSymbol === "X" ? "O" : "X");
          }
        } else {
          // Spot is already taken -> turn missed!
          setDiceMessage({
            type: "miss",
            text: `Rolled #${finalRoll} — Already occupied by ${board[targetIndex]}! Turn forfeited!`,
          });
          setTurn(playerSymbol === "X" ? "O" : "X");
        }

        setIsRolling(false);
      }
    }, 60);
  }, [board, vsAI, recordWin]);

  const handleRollDice = () => {
    if (isRolling || winnerData.winner || (vsAI && turn === "O")) return;
    executeRoll(turn);
  };

  // AI Automatic Roll Turn
  useEffect(() => {
    if (!vsAI || turn !== "O" || winnerData.winner || isRolling) return;

    const aiTimer = setTimeout(() => {
      executeRoll("O");
    }, 900);

    return () => clearTimeout(aiTimer);
  }, [vsAI, turn, winnerData.winner, isRolling, executeRoll]);

  const handleResetMatch = () => {
    playTapSound();
    setBoard(Array(9).fill(null));
    setTurn("X");
    setWinnerData({ winner: null, line: null });
    setIsRolling(false);
    setCurrentDiceNum(null);
    setLastTargetIndex(null);
    setDiceMessage({
      type: "info",
      text: "Roll the 9-sided die to pick a spot (1 to 9).",
    });
  };

  return (
    <div className="w-full max-w-4xl px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center text-slate-100">
      {/* Top Navigation & Opponent Selector */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 pb-4 border-b border-amber-500/20">
        <button
          onClick={() => {
            playTapSound();
            setActiveMode("lobby");
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-amber-200 bg-slate-900/80 border border-amber-500/40 hover:bg-slate-800 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(250,204,21,0.2)] self-start sm:self-auto"
        >
          <FaHome />
          <span>Exit to Lobby</span>
        </button>

        {/* Mode & Opponent Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-amber-500/40">
          <button
            onClick={() => {
              playTapSound();
              setVsAI(true);
              handleResetMatch();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              vsAI
                ? "bg-amber-500 text-slate-950 font-black shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                : "text-amber-200 hover:text-white"
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
                ? "bg-amber-500 text-slate-950 font-black shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                : "text-amber-200 hover:text-white"
            }`}
          >
            <FaUserFriends className="text-sm" />
            <span>2-Player Local</span>
          </button>
        </div>
      </div>

      {/* Players Profile & Live Turn Card */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 items-center bg-slate-900/80 border border-amber-500/40 p-2.5 sm:p-4 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.5)] mb-6 backdrop-blur-md">
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
            <p className="text-[10px] sm:text-[11px] text-amber-200/70 font-medium truncate">Wins: {scores.dice.player}</p>
          </div>
        </div>

        {/* Center Live Outcome */}
        <div className="col-span-2 sm:col-span-1 order-last sm:order-none flex flex-col items-center justify-center">
          {winnerData.winner ? (
            <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <FaCrown className="text-amber-400" />
              <span>
                {winnerData.winner === "draw"
                  ? "Match Drawn!"
                  : winnerData.winner === "X"
                  ? vsAI
                    ? "You Won!"
                    : "Player 1 Won!"
                  : vsAI
                  ? "Bot Won!"
                  : "Player 2 Won!"}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-amber-500/40 text-xs font-semibold text-amber-300">
              <span className="text-[11px] text-amber-400/70">Turn:</span>
              <span className="font-bold flex items-center gap-1 text-white">
                {turn === "X" ? (
                  <span>Your Turn (Fox 🦊)</span>
                ) : vsAI ? (
                  <span>{isRolling ? "🤖 Rolling..." : "Bot's Turn"}</span>
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
              ? "bg-amber-950/60 border-2 border-amber-500 shadow-[0_0_20px_rgba(250,204,21,0.3)] scale-[1.02]"
              : "bg-slate-950/60 border border-purple-500/20"
          }`}
        >
          <div className="text-right min-w-0">
            <div className="flex items-center justify-end gap-1">
              <span className="text-[10px] font-black text-amber-300 bg-amber-950 px-1 rounded border border-amber-500/40">O</span>
              <span className="font-bold text-white text-xs sm:text-sm truncate">
                {vsAI ? "Smart Bot" : "Player 2"}
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-amber-200/70 font-medium truncate">Wins: {scores.dice.ai}</p>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-lg sm:text-xl shadow-[0_0_15px_rgba(250,204,21,0.4)] shrink-0">
            {vsAI ? <FaRobot /> : <GiLion />}
          </div>
        </div>
      </div>

      {/* Main Dice Interaction Bar */}
      <div className="w-full bg-slate-900/80 border border-amber-500/40 p-3.5 sm:p-4 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-6 backdrop-blur-md">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-black shadow-xs transition-transform shrink-0 ${
              isRolling
                ? "bg-amber-400 text-slate-950 animate-bounce scale-110 shadow-[0_0_25px_rgba(250,204,21,0.8)]"
                : currentDiceNum
                ? "bg-amber-500 text-slate-950 scale-100 shadow-[0_0_20px_rgba(250,204,21,0.6)]"
                : "bg-amber-950/60 text-amber-400 border border-amber-500/40"
            }`}
          >
            {currentDiceNum ? `#${currentDiceNum}` : <FaDice className="text-2xl sm:text-3xl" />}
          </div>
          <div className="text-left min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">
              {isRolling ? "Rolling the 9-sided die..." : currentDiceNum ? `Rolled #${currentDiceNum}` : "Ready to roll!"}
            </p>
            <p
              className={`text-[11px] sm:text-xs mt-0.5 ${
                diceMessage.type === "miss"
                  ? "text-rose-400 font-bold drop-shadow-xs"
                  : diceMessage.type === "success"
                  ? "text-emerald-400 font-bold drop-shadow-xs"
                  : "text-amber-200/70"
              }`}
            >
              {diceMessage.text}
            </p>
          </div>
        </div>

        {/* Roll Dice Button */}
        <button
          onClick={handleRollDice}
          disabled={isRolling || !!winnerData.winner || (vsAI && turn === "O")}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer select-none active:scale-95 ${
            isRolling || !!winnerData.winner || (vsAI && turn === "O")
              ? "bg-slate-800 text-slate-500 cursor-not-allowed"
              : "bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-[0_0_25px_rgba(250,204,21,0.5)]"
          }`}
        >
          <FaDice className="text-base" />
          <span>{isRolling ? "Rolling..." : vsAI && turn === "O" ? "Bot's Turn..." : "Roll Dice"}</span>
        </button>
      </div>

      {/* 9-Numbered Visual Grid */}
      <div className="p-3 min-[360px]:p-4 sm:p-6 rounded-3xl bg-slate-950/80 border-2 border-amber-500/40 shadow-[0_0_40px_rgba(0,0,0,0.8),inset_0_0_25px_rgba(250,204,21,0.1)] mb-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-3.5">
          {board.map((val, idx) => {
            const cellNumber = idx + 1;
            const isWinningCell = winnerData.line && winnerData.line.includes(idx);
            const isLastTarget = lastTargetIndex === idx;

            return (
              <div
                key={idx}
                className={`w-[68px] h-[68px] min-[360px]:w-20 min-[360px]:h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center relative transition-all duration-300 select-none ${
                  isWinningCell
                    ? "bg-emerald-900/80 border-4 border-emerald-400 text-emerald-200 scale-105 shadow-[0_0_30px_rgba(16,185,129,0.7)] z-10"
                    : isLastTarget
                    ? "ring-4 ring-amber-400 shadow-[0_0_25px_rgba(250,204,21,0.6)]"
                    : ""
                } ${
                  val === "X"
                    ? "bg-rose-950/70 text-rose-300 border-2 border-rose-500/80 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                    : val === "O"
                    ? "bg-amber-950/70 text-amber-300 border-2 border-amber-500/80 shadow-[0_0_20px_rgba(250,204,21,0.3)]"
                    : "bg-slate-900/60 border-2 border-dashed border-amber-500/30 text-amber-500/40"
                }`}
              >
                <span className="absolute top-1.5 left-2 text-[10px] sm:text-xs font-black font-mono text-amber-500/70">
                  #{cellNumber}
                </span>

                {val === "X" && <GiFox className="text-2xl min-[360px]:text-3xl sm:text-4xl text-rose-400 mt-1" />}
                {val === "O" && (
                  vsAI ? (
                    <FaRobot className="text-2xl min-[360px]:text-3xl sm:text-4xl text-amber-400 mt-1" />
                  ) : (
                    <GiLion className="text-2xl min-[360px]:text-3xl sm:text-4xl text-amber-400 mt-1" />
                  )
                )}
                {!val && (
                  <div className="text-center">
                    <span className="text-xl min-[360px]:text-2xl font-black text-amber-400/40">{cellNumber}</span>
                    <span className="block text-[8px] min-[360px]:text-[9px] text-amber-400/40 font-medium">Free</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleResetMatch}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(250,204,21,0.4)] transition-all cursor-pointer active:scale-95"
        >
          <HiMiniArrowPath className="text-base" />
          <span>{winnerData.winner ? "Play Again" : "Reset Board"}</span>
        </button>

        <button
          onClick={() => {
            playTapSound();
            resetScores("dice");
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-amber-500/30 text-amber-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
        >
          <FaRedo className="text-xs text-amber-400" />
          <span>Reset Match Score</span>
        </button>
      </div>
    </div>
  );
};

export default DiceArena;
