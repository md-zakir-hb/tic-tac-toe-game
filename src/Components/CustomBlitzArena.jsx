import { useEffect, useState } from "react";
import { FaCrown, FaHistory, FaHome, FaRedo, FaSlidersH } from "react-icons/fa";
import { HiMiniArrowPath } from "react-icons/hi2";
import { PiTimerFill } from "react-icons/pi";
import { useGameStore } from "../store/useGameStore";
import { checkWinner } from "../utils/gameRules";
import { icons } from "../utils/icons";
import { playDrawSound, playMoveSound, playTapSound, playWinSound } from "../utils/soundEffects";
import History from "./History";
import Square from "./Square";

const CustomBlitzArena = () => {
  const {
    setActiveMode,
    setIsModalOpen,
    player1,
    player2,
    selectedColor1,
    selectedColor2,
    selectedIcon1,
    selectedIcon2,
    matchDuration,
    tossWinner,
    scores,
    recordWin,
    resetScores,
  } = useGameStore();

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [xIsNext, setXIsNext] = useState(tossWinner === player1);
  const [status, setStatus] = useState(null); // 'X' | 'O' | 'draw' | null
  const [winningLine, setWinningLine] = useState(null);

  const [time1, setTime1] = useState(matchDuration);
  const [time2, setTime2] = useState(matchDuration);
  const [isRunning, setIsRunning] = useState(true);

  const currentSquares = history[currentMove];
  const icon1 = icons.find((i) => i.title === selectedIcon1);
  const icon2 = icons.find((i) => i.title === selectedIcon2);

  // Timer Countdown Effect
  useEffect(() => {
    if (!isRunning || status) return;

    const timer = setInterval(() => {
      if (xIsNext) {
        setTime1((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setStatus("O");
            setIsRunning(false);
            playWinSound();
            recordWin("custom", "O");
            return 0;
          }
          return prev - 1;
        });
      } else {
        setTime2((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setStatus("X");
            setIsRunning(false);
            playWinSound();
            recordWin("custom", "X");
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, xIsNext, status, recordWin]);

  const handleCellClick = (i) => {
    if (currentSquares[i] || status) return;

    playMoveSound(xIsNext);
    const nextSquares = [...currentSquares];
    nextSquares[i] = xIsNext ? "X" : "O";

    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    const result = checkWinner(nextSquares);
    if (result.winner) {
      setStatus(result.winner);
      setWinningLine(result.line);
      setIsRunning(false);
      if (result.winner === "draw") {
        playDrawSound();
        recordWin("custom", "draw");
      } else {
        playWinSound();
        recordWin("custom", result.winner);
      }
    } else {
      setXIsNext(!xIsNext);
    }
  };

  const jumpTo = (move) => {
    playTapSound();
    setCurrentMove(move);
    setXIsNext(move % 2 === 0);
  };

  const handleResetMatch = () => {
    playTapSound();
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setStatus(null);
    setWinningLine(null);
    setTime1(matchDuration);
    setTime2(matchDuration);
    setXIsNext(tossWinner === player1);
    setIsRunning(true);
  };

  return (
    <div className="w-full max-w-5xl px-4 sm:px-6 py-6 sm:py-8 flex flex-col lg:flex-row items-start justify-between gap-8 text-slate-100">
      {/* Main Playing Arena Column */}
      <div className="flex-1 w-full flex flex-col items-center">
        {/* Top Header Bar */}
        <div className="w-full flex items-center justify-between pb-4 mb-6 border-b border-purple-500/20">
          <button
            onClick={() => {
              playTapSound();
              setActiveMode("lobby");
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-purple-200 bg-slate-900/80 border border-purple-500/40 hover:bg-slate-800 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.2)]"
          >
            <FaHome />
            <span>Exit to Lobby</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              BLITZ TIMER • {matchDuration}s CLOCK
            </span>
            <button
              onClick={() => {
                playTapSound();
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1 text-xs font-semibold text-purple-200 bg-slate-900/80 border border-purple-500/40 hover:bg-slate-800 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              title="Edit Player Settings"
            >
              <FaSlidersH className="text-purple-400" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>

        {/* Players Profile & Countdown Clocks Card */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 items-center bg-slate-900/80 border border-purple-500/40 p-2.5 sm:p-4 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.5)] mb-6 backdrop-blur-md">
          {/* Player 1 Card */}
          <div
            className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl transition-all ${
              xIsNext && !status
                ? "bg-indigo-950/60 border-2 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)] scale-[1.02]"
                : "bg-slate-950/60 border border-purple-500/20"
            }`}
          >
            <div
              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl ${selectedColor1} flex items-center justify-center text-white text-lg sm:text-xl shadow-[0_0_15px_rgba(255,255,255,0.2)] shrink-0`}
            >
              {icon1?.icon ? <icon1.icon /> : <span>X</span>}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-bold text-white text-xs sm:text-sm truncate">
                  {player1 || "Player 1"}
                </span>
                <span className="text-[10px] font-black text-indigo-300 bg-indigo-950 px-1 rounded border border-indigo-500/40">X</span>
              </div>
              <div className="flex flex-wrap items-center gap-1 mt-1 text-[10px] sm:text-xs">
                <PiTimerFill className="text-amber-400" />
                <span
                  className={`font-mono font-bold ${
                    time1 <= 5 && !status ? "text-rose-400 animate-pulse font-extrabold" : "text-purple-200"
                  }`}
                >
                  {time1}s left
                </span>
                <span className="text-purple-700 hidden sm:inline">•</span>
                <span className="text-[9px] sm:text-[10px] text-purple-300/70 font-semibold truncate">Wins: {scores.custom.player1}</span>
              </div>
            </div>
          </div>

          {/* Center Outcome / Turn Badge */}
          <div className="col-span-2 sm:col-span-1 order-last sm:order-none flex flex-col items-center justify-center">
            {status ? (
              <div className="flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <FaCrown className="text-amber-400" />
                <span>
                  {status === "draw"
                    ? "Match Draw!"
                    : status === "X"
                    ? `${player1 || "Player 1"} Wins!`
                    : `${player2 || "Player 2"} Wins!`}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-slate-950/80 border border-purple-500/30 text-[11px] sm:text-xs font-semibold text-purple-200">
                <span className="text-[11px] text-purple-400">Turn:</span>
                <span className="font-bold text-white truncate max-w-[120px] sm:max-w-none">
                  {xIsNext ? player1 || "Player 1" : player2 || "Player 2"}
                </span>
              </div>
            )}
          </div>

          {/* Player 2 Card */}
          <div
            className={`flex items-center justify-end gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl transition-all ${
              !xIsNext && !status
                ? "bg-rose-950/60 border-2 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)] scale-[1.02]"
                : "bg-slate-950/60 border border-purple-500/20"
            }`}
          >
            <div className="text-right min-w-0">
              <div className="flex items-center justify-end gap-1 sm:gap-1.5">
                <span className="text-[10px] font-black text-rose-300 bg-rose-950 px-1 rounded border border-rose-500/40">O</span>
                <span className="font-bold text-white text-xs sm:text-sm truncate">
                  {player2 || "Player 2"}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-1 mt-1 text-[10px] sm:text-xs">
                <span className="text-[9px] sm:text-[10px] text-purple-300/70 font-semibold truncate">Wins: {scores.custom.player2}</span>
                <span className="text-purple-700 hidden sm:inline">•</span>
                <PiTimerFill className="text-amber-400" />
                <span
                  className={`font-mono font-bold ${
                    time2 <= 5 && !status ? "text-rose-400 animate-pulse font-extrabold" : "text-purple-200"
                  }`}
                >
                  {time2}s left
                </span>
              </div>
            </div>
            <div
              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl ${selectedColor2} flex items-center justify-center text-white text-lg sm:text-xl shadow-[0_0_15px_rgba(255,255,255,0.2)] shrink-0`}
            >
              {icon2?.icon ? <icon2.icon /> : <span>O</span>}
            </div>
          </div>
        </div>

        {/* 3x3 Custom Grid */}
        <div className="p-3 min-[360px]:p-4 sm:p-5 rounded-3xl bg-slate-950/80 border-2 border-purple-500/40 shadow-[0_0_40px_rgba(0,0,0,0.8),inset_0_0_25px_rgba(168,85,247,0.15)] mb-6">
          <div className="grid grid-cols-3">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Square
                key={i}
                value={currentSquares[i]}
                onSquareClick={() => handleCellClick(i)}
                selectedColor1={selectedColor1}
                selectedColor2={selectedColor2}
                selectedIcon1={selectedIcon1}
                selectedIcon2={selectedIcon2}
                isWinningCell={winningLine && winningLine.includes(i)}
              />
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetMatch}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all cursor-pointer active:scale-95"
          >
            <HiMiniArrowPath className="text-base" />
            <span>{status ? "Play Again" : "Reset Match"}</span>
          </button>

          <button
            onClick={() => {
              playTapSound();
              resetScores("custom");
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-purple-500/30 text-purple-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <FaRedo className="text-xs text-purple-400" />
            <span>Reset Match Score</span>
          </button>
        </div>
      </div>

      {/* Move History Sidebar Column */}
      <aside className="w-full lg:w-72 bg-slate-900/80 border border-purple-500/30 rounded-3xl p-5 flex flex-col shadow-[0_4px_25px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <div className="flex items-center gap-2 pb-3.5 border-b border-purple-500/30">
          <FaHistory className="text-purple-400 text-sm" />
          <h3 className="font-bold text-white text-sm">Move History Replay</h3>
        </div>

        <div className="mt-3 flex-1 overflow-y-auto max-h-96">
          {!status ? (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-purple-500/20 text-center text-xs text-purple-300/70">
              <p>Move history will be active once the match finishes.</p>
              <p className="mt-2 text-[11px] text-purple-400/50">Total moves made: {history.length - 1}</p>
            </div>
          ) : (
            <div>
              <p className="text-xs text-purple-300/70 mb-2">Click any step to rewind the board:</p>
              <History history={history} jumpTo={jumpTo} />
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default CustomBlitzArena;
