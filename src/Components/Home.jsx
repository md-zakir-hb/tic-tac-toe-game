import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaDice, FaPlay, FaRobot } from "react-icons/fa";
import { GiFox, GiHorseHead, GiLion, GiTigerHead } from "react-icons/gi";
import { HiMiniArrowPath } from "react-icons/hi2";
import { LuBird } from "react-icons/lu";
import {
  PiCoinsFill,
  PiDiceSixFill,
  PiGameControllerFill,
  PiHourglassFill,
  PiLightbulbFill,
  PiTimerFill,
} from "react-icons/pi";
import { TbTicTac } from "react-icons/tb";
import { infoData } from "../utils/infoData.js";

const Home = ({ handleOpenModal }) => {
  // ==========================================
  // 1. CLASSICAL DEMO STATE & SMART AI
  // ==========================================
  const [demoBoard, setDemoBoard] = useState(Array(9).fill(null));
  const [demoXIsNext, setDemoXIsNext] = useState(true);
  const [demoWinner, setDemoWinner] = useState(null);
  const [demoModeVsAI, setDemoModeVsAI] = useState(true); // true = vs AI, false = 2P Local
  const [isDemoAiThinking, setIsDemoAiThinking] = useState(false);

  // Trivia index state
  const [triviaIndex, setTriviaIndex] = useState(0);

  // ==========================================
  // 2. 🎲 LUDO-STYLE DICE LUCK MODE WITH AI
  // ==========================================
  const [diceBoard, setDiceBoard] = useState(Array(9).fill(null));
  const [diceTurn, setDiceTurn] = useState("X"); // 'X' = Human (Fox), 'O' = AI / Player 2
  const [diceWinner, setDiceWinner] = useState(null); // 'X' | 'O' | 'draw' | null
  const [winningLine, setWinningLine] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [displayDiceNum, setDisplayDiceNum] = useState(null);
  const [lastTargetIndex, setLastTargetIndex] = useState(null);
  const [diceModeVsAI, setDiceModeVsAI] = useState(true); // true = vs AI, false = 2P Local
  const [diceMessage, setDiceMessage] = useState({
    type: "info",
    text: "Roll the dice to pick a random spot (1 to 9). If the spot is already taken, your turn is missed!",
  });
  const [rollHistory, setRollHistory] = useState([]);

  // ==========================================
  // 3. ⏳ VANISHING MODE (3-PIECES MAX) WITH AI
  // ==========================================
  const [vanishBoard, setVanishBoard] = useState(Array(9).fill(null));
  const [vanishP1Moves, setVanishP1Moves] = useState([]); // queue of indices (max 3)
  const [vanishP2Moves, setVanishP2Moves] = useState([]); // queue of indices (max 3)
  const [vanishTurn, setVanishTurn] = useState("X"); // 'X' (Human) or 'O' (AI / Player 2)
  const [vanishWinner, setVanishWinner] = useState(null);
  const [vanishWinningLine, setVanishWinningLine] = useState(null);
  const [vanishModeVsAI, setVanishModeVsAI] = useState(true); // true = vs AI, false = 2-Player local
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [vanishMoveCount, setVanishMoveCount] = useState(0);

  // Win checker helper for standard 3x3
  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (squares.every((sq) => sq !== null)) {
      return "draw";
    }
    return null;
  };

  const checkDiceWin = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    if (squares.every((sq) => sq !== null)) {
      return { winner: "draw", line: null };
    }
    return null;
  };

  const checkVanishWin = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    return null;
  };

  // ------------------------------------------
  // CLASSICAL DEMO HANDLERS & AI
  // ------------------------------------------
  const getClassicalAiMove = (board) => {
    const available = [];
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) available.push(i);
    }
    if (available.length === 0) return 0;

    // 1. Can AI ('O') win immediately?
    for (const move of available) {
      const sim = [...board];
      sim[move] = "O";
      if (checkWinner(sim) === "O") return move;
    }

    // 2. Can Human ('X') win on next turn? Block them!
    for (const move of available) {
      const sim = [...board];
      sim[move] = "X";
      if (checkWinner(sim) === "X") return move;
    }

    // 3. Take center square if free
    if (available.includes(4)) return 4;

    // 4. Take a corner if free
    const corners = [0, 2, 6, 8].filter((c) => available.includes(c));
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];

    // 5. Fallback random
    return available[Math.floor(Math.random() * available.length)];
  };

  // Human click in Classical Demo
  const handleDemoClick = (index) => {
    if (demoBoard[index] || demoWinner || isDemoAiThinking) return;
    if (demoModeVsAI && !demoXIsNext) return;

    const nextBoard = [...demoBoard];
    nextBoard[index] = demoXIsNext ? "X" : "O";
    setDemoBoard(nextBoard);

    const win = checkWinner(nextBoard);
    if (win) {
      setDemoWinner(win);
    } else {
      setDemoXIsNext(!demoXIsNext);
    }
  };

  // AI Turn in Classical Demo
  useEffect(() => {
    if (demoModeVsAI && !demoXIsNext && !demoWinner) {
      setIsDemoAiThinking(true);
      const timer = setTimeout(() => {
        const aiMove = getClassicalAiMove(demoBoard);
        const nextBoard = [...demoBoard];
        nextBoard[aiMove] = "O";
        setDemoBoard(nextBoard);

        const win = checkWinner(nextBoard);
        if (win) {
          setDemoWinner(win);
        } else {
          setDemoXIsNext(true);
        }
        setIsDemoAiThinking(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [demoModeVsAI, demoXIsNext, demoWinner, demoBoard]);

  const handleResetDemo = () => {
    setDemoBoard(Array(9).fill(null));
    setDemoXIsNext(true);
    setDemoWinner(null);
    setIsDemoAiThinking(false);
  };

  // ------------------------------------------
  // 🎲 DICE ROLL HANDLER WITH TURN MISS & AI
  // ------------------------------------------
  const handleRollDice = () => {
    if (isRolling || diceWinner) return;

    setIsRolling(true);
    setLastTargetIndex(null);

    let count = 0;
    const interval = setInterval(() => {
      setDisplayDiceNum(Math.floor(Math.random() * 9) + 1);
      count++;

      if (count >= 10) {
        clearInterval(interval);

        const finalNum = Math.floor(Math.random() * 9) + 1;
        const targetIdx = finalNum - 1;
        setDisplayDiceNum(finalNum);
        setLastTargetIndex(targetIdx);
        setIsRolling(false);

        const currentPlayerName =
          diceTurn === "X"
            ? "Player 1 (Fox 🦊)"
            : diceModeVsAI
            ? "Smart Bot (🤖)"
            : "Player 2 (Lion 🦁)";

        // Check if the rolled cell is ALREADY taken
        if (diceBoard[targetIdx] !== null) {
          const occupant =
            diceBoard[targetIdx] === "X"
              ? "Player 1 (Fox 🦊)"
              : diceModeVsAI
              ? "Smart Bot (🤖)"
              : "Player 2 (Lion 🦁)";

          // TURN MISSED!
          setDiceMessage({
            type: "miss",
            text: `⚠️ Rolled #${finalNum} — Square #${finalNum} is already occupied by ${occupant}! Turn Missed! 💨`,
          });
          setRollHistory((prev) => [
            { player: diceTurn, roll: finalNum, status: "miss" },
            ...prev.slice(0, 5),
          ]);
          setDiceTurn((prev) => (prev === "X" ? "O" : "X"));
        } else {
          // Spot is FREE! Claim it!
          const nextBoard = [...diceBoard];
          nextBoard[targetIdx] = diceTurn;
          setDiceBoard(nextBoard);

          const winResult = checkDiceWin(nextBoard);

          if (winResult) {
            if (winResult.winner === "draw") {
              setDiceWinner("draw");
              setDiceMessage({
                type: "draw",
                text: `🤝 Rolled #${finalNum} — All 9 squares filled! Match ended in a draw!`,
              });
            } else {
              setDiceWinner(winResult.winner);
              setWinningLine(winResult.line);
              setDiceMessage({
                type: "win",
                text: `🎉 LUCK WINS! ${currentPlayerName} rolled #${finalNum} and connected 3 in a row! Victory!`,
              });
            }
          } else {
            setDiceMessage({
              type: "hit",
              text: `🎯 Nice roll! ${currentPlayerName} rolled #${finalNum} and claimed square #${finalNum}!`,
            });
            setDiceTurn((prev) => (prev === "X" ? "O" : "X"));
          }

          setRollHistory((prev) => [
            { player: diceTurn, roll: finalNum, status: "hit" },
            ...prev.slice(0, 5),
          ]);
        }
      }
    }, 45);
  };

  // AI Turn in Ludo Dice Mode: Automatically rolls dice!
  useEffect(() => {
    if (diceModeVsAI && diceTurn === "O" && !diceWinner && !isRolling) {
      const timer = setTimeout(() => {
        handleRollDice();
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [diceModeVsAI, diceTurn, diceWinner, isRolling, diceBoard]);

  const handleResetDiceGame = () => {
    setDiceBoard(Array(9).fill(null));
    setDiceTurn("X");
    setDiceWinner(null);
    setWinningLine(null);
    setIsRolling(false);
    setDisplayDiceNum(null);
    setLastTargetIndex(null);
    setDiceMessage({
      type: "info",
      text: "New dice round started! Roll the dice to see who luck favors first.",
    });
    setRollHistory([]);
  };

  // ------------------------------------------
  // ⏳ VANISHING MODE HANDLERS & SMART AI
  // ------------------------------------------
  const handleVanishCellClick = (idx) => {
    if (vanishWinner || (vanishModeVsAI && vanishTurn === "O") || isAiThinking) return;

    const currentMoves = vanishTurn === "X" ? vanishP1Moves : vanishP2Moves;
    const oldestMove = currentMoves.length === 3 ? currentMoves[0] : null;

    if (vanishBoard[idx] !== null && idx !== oldestMove) return;

    executeVanishMove(idx, vanishTurn);
  };

  const executeVanishMove = (targetIdx, player) => {
    const nextBoard = [...vanishBoard];
    let nextP1Moves = [...vanishP1Moves];
    let nextP2Moves = [...vanishP2Moves];

    if (player === "X") {
      if (nextP1Moves.length === 3) {
        const oldest = nextP1Moves.shift();
        nextBoard[oldest] = null;
      }
      nextBoard[targetIdx] = "X";
      nextP1Moves.push(targetIdx);
    } else {
      if (nextP2Moves.length === 3) {
        const oldest = nextP2Moves.shift();
        nextBoard[oldest] = null;
      }
      nextBoard[targetIdx] = "O";
      nextP2Moves.push(targetIdx);
    }

    setVanishBoard(nextBoard);
    setVanishP1Moves(nextP1Moves);
    setVanishP2Moves(nextP2Moves);
    setVanishMoveCount((prev) => prev + 1);

    const winResult = checkVanishWin(nextBoard);
    if (winResult) {
      setVanishWinner(winResult.winner);
      setVanishWinningLine(winResult.line);
    } else {
      setVanishTurn(player === "X" ? "O" : "X");
    }
  };

  const getSmartAiMove = (board, p1Moves, p2Moves) => {
    const aiOldest = p2Moves.length === 3 ? p2Moves[0] : null;

    const validMoves = [];
    for (let i = 0; i < 9; i++) {
      if (board[i] === null || i === aiOldest) {
        validMoves.push(i);
      }
    }

    if (validMoves.length === 0) return 0;

    // 1. Can AI Win immediately?
    for (const move of validMoves) {
      const simulatedBoard = [...board];
      if (aiOldest !== null) simulatedBoard[aiOldest] = null;
      simulatedBoard[move] = "O";
      const win = checkVanishWin(simulatedBoard);
      if (win && win.winner === "O") return move;
    }

    // 2. Can Human win next turn? Block!
    const humanOldest = p1Moves.length === 3 ? p1Moves[0] : null;
    const humanWinningMoves = [];
    for (let i = 0; i < 9; i++) {
      if (board[i] === null || i === humanOldest) {
        const simulatedBoard = [...board];
        if (humanOldest !== null) simulatedBoard[humanOldest] = null;
        simulatedBoard[i] = "X";
        const win = checkVanishWin(simulatedBoard);
        if (win && win.winner === "X") humanWinningMoves.push(i);
      }
    }

    for (const blockMove of humanWinningMoves) {
      if (validMoves.includes(blockMove)) return blockMove;
    }

    // 3. Take Center
    if (validMoves.includes(4)) return 4;

    // 4. Take Corner
    const corners = [0, 2, 6, 8].filter((c) => validMoves.includes(c));
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];

    return validMoves[Math.floor(Math.random() * validMoves.length)];
  };

  useEffect(() => {
    if (vanishModeVsAI && vanishTurn === "O" && !vanishWinner) {
      setIsAiThinking(true);
      const timer = setTimeout(() => {
        const bestMove = getSmartAiMove(vanishBoard, vanishP1Moves, vanishP2Moves);
        executeVanishMove(bestMove, "O");
        setIsAiThinking(false);
      }, 550);

      return () => clearTimeout(timer);
    }
  }, [vanishModeVsAI, vanishTurn, vanishWinner, vanishBoard, vanishP1Moves, vanishP2Moves]);

  const handleResetVanishGame = () => {
    setVanishBoard(Array(9).fill(null));
    setVanishP1Moves([]);
    setVanishP2Moves([]);
    setVanishTurn("X");
    setVanishWinner(null);
    setVanishWinningLine(null);
    setIsAiThinking(false);
    setVanishMoveCount(0);
  };

  // Trivia handlers
  const nextTrivia = () => {
    setTriviaIndex((prev) => (prev + 1) % infoData.length);
  };

  const prevTrivia = () => {
    setTriviaIndex((prev) => (prev - 1 + infoData.length) % infoData.length);
  };

  const currentTrivia = infoData[triviaIndex];

  return (
    <div className="w-full flex flex-col items-center justify-start text-slate-800 bg-[#f8fafc]">
      {/* Clean Light Navbar */}
      <nav className="w-full max-w-6xl px-6 py-4 flex items-center justify-between border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <TbTicTac className="text-2xl" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">
              Tic Tac Toe
            </span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Classic • Dice • Vanishing AI
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600">
          <a href="#demo" className="hover:text-indigo-600 transition-colors">
            Classical AI
          </a>
          <a
            href="#dice-mode"
            className="flex items-center gap-1.5 font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-full border border-amber-200 transition-all text-xs"
          >
            <span>🎲</span>
            <span>Dice AI Mode</span>
          </a>
          <a
            href="#vanishing-mode"
            className="flex items-center gap-1.5 font-bold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200 transition-all text-xs"
          >
            <span>⏳</span>
            <span>Vanishing AI</span>
          </a>
          <a href="#how-to-play" className="hover:text-indigo-600 transition-colors">
            How to Play
          </a>
          <a href="#trivia" className="hover:text-indigo-600 transition-colors">
            Trivia
          </a>
        </div>

        <button
          onClick={handleOpenModal}
          id="nav-play-btn"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm hover:shadow transition-all cursor-pointer active:scale-95"
        >
          <PiGameControllerFill className="text-lg" />
          <span>Start Full Game</span>
        </button>
      </nav>

      {/* Hero Section */}
      <header className="w-full max-w-5xl px-6 pt-16 pb-14 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold mb-6">
          <span>🤖</span>
          <span>Smart AI Opponent in All Modes!</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-3xl">
          The classic game of Tic Tac Toe, made even more fun.
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
          Play against a friend or challenge our <strong>Smart AI Bot</strong> across <strong>Classical</strong>, <strong>Ludo Dice</strong>, and <strong>Vanishing (No-Draw)</strong> modes!
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#demo"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <FaRobot className="text-base" />
            <span>Play Classical vs AI</span>
          </a>

          <a
            href="#dice-mode"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-base shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <FaDice className="text-base" />
            <span>Play Dice Luck vs AI</span>
          </a>

          <a
            href="#vanishing-mode"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-100 hover:bg-indigo-200 border border-indigo-300 text-indigo-900 font-bold text-base shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <PiHourglassFill className="text-base text-indigo-700" />
            <span>Vanishing Mode</span>
          </a>
        </div>

        {/* Quick Highlights */}
        <div className="mt-12 w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Mode 1</span>
            <p className="font-bold text-slate-900 text-sm mt-0.5">🤖 Classical vs AI</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Mode 2</span>
            <p className="font-bold text-slate-900 text-sm mt-0.5">🎲 Dice Luck vs AI</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Mode 3</span>
            <p className="font-bold text-slate-900 text-sm mt-0.5">⏳ Vanishing vs AI</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Multiplayer</span>
            <p className="font-bold text-slate-900 text-sm mt-0.5">👥 2-Player Local</p>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 1. CLASSICAL MODE (WITH SMART AI & 2P TOGGLE)                  */}
      {/* ============================================================== */}
      <section id="demo" className="w-full max-w-5xl px-6 py-10 scroll-mt-20">
        <div className="p-8 sm:p-10 rounded-2xl bg-white border border-slate-200 shadow-sm">
          {/* Header with AI Mode Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                Mode 1: Classical 3x3
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
                Classical Mode (ক্লাসিক্যাল মোড)
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                চিরচেনা ৩x৩ গ্রিডে খেলুন—স্মার্ট এআই বটের সাথে অথবা পাশে থাকা বন্ধুর সাথে!
              </p>
            </div>

            {/* Toggle: vs AI or 2P */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start sm:self-center">
              <button
                onClick={() => {
                  setDemoModeVsAI(true);
                  handleResetDemo();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  demoModeVsAI
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FaRobot className="text-sm" />
                <span>Play vs Smart AI</span>
              </button>
              <button
                onClick={() => {
                  setDemoModeVsAI(false);
                  handleResetDemo();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !demoModeVsAI
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>👥 2-Player Local</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-6">
            {/* Left Column: Info & Status */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 w-full">
                <span className="text-xs text-slate-500 font-medium">Match Status:</span>
                <div className="mt-1 text-sm font-semibold">
                  {demoWinner ? (
                    demoWinner === "draw" ? (
                      <span className="text-amber-700 font-bold">🤝 Match ended in a draw!</span>
                    ) : (
                      <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                        <span>🎉 Winner:</span>
                        <span>
                          {demoWinner === "X"
                            ? "Player 1 (Fox 🦊)"
                            : demoModeVsAI
                            ? "Smart Bot (🤖)"
                            : "Player 2 (Lion 🦁)"}
                        </span>
                      </span>
                    )
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-700">Turn:</span>
                      <span className="font-bold text-indigo-700 flex items-center gap-1.5">
                        {demoXIsNext ? (
                          <>
                            <GiFox className="text-rose-600 text-base" />
                            <span>Your Turn (Fox 🦊)</span>
                          </>
                        ) : demoModeVsAI ? (
                          <>
                            <FaRobot className="text-indigo-600 text-base" />
                            <span>{isDemoAiThinking ? "🤖 Bot Thinking..." : "Smart Bot's Turn"}</span>
                          </>
                        ) : (
                          <>
                            <GiLion className="text-amber-600 text-base" />
                            <span>Player 2 (Lion 🦁)</span>
                          </>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={handleResetDemo}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-all cursor-pointer"
                >
                  <HiMiniArrowPath className="text-base" />
                  <span>{demoWinner ? "Play Again" : "Reset Board"}</span>
                </button>
                <button
                  onClick={handleOpenModal}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-all cursor-pointer"
                >
                  Setup Timed Match
                </button>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 w-full">
                <strong>🤖 Classical AI:</strong> Calculates intelligent blocks and winning combinations with real-time heuristic response.
              </div>
            </div>

            {/* Right Column: Physical-style clean 3x3 board */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              <div className="p-3 sm:p-4 rounded-2xl bg-slate-100 border border-slate-200 shadow-inner">
                <div className="grid grid-cols-3 gap-2.5">
                  {demoBoard.map((val, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleDemoClick(idx)}
                      id={`demo-tile-${idx}`}
                      disabled={!!val || !!demoWinner || isDemoAiThinking}
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl flex items-center justify-center text-3xl font-bold transition-all select-none ${
                        val === "X"
                          ? "bg-rose-50 text-rose-600 border-2 border-rose-300 shadow-xs"
                          : val === "O"
                          ? "bg-indigo-50 text-indigo-600 border-2 border-indigo-300 shadow-xs"
                          : isDemoAiThinking
                          ? "bg-white border border-slate-200 opacity-60 cursor-wait"
                          : "bg-white hover:bg-slate-50 border border-slate-300 shadow-xs hover:border-indigo-400 cursor-pointer"
                      }`}
                    >
                      {val === "X" && <GiFox className="text-3xl text-rose-500" />}
                      {val === "O" && (
                        demoModeVsAI ? (
                          <FaRobot className="text-3xl text-indigo-600" />
                        ) : (
                          <GiLion className="text-3xl text-amber-500" />
                        )
                      )}
                      {!val && <span className="text-slate-300 text-base">·</span>}
                    </button>
                  ))}
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                {demoModeVsAI && !demoXIsNext && !demoWinner
                  ? "Bot is making a strategic move..."
                  : "Click any square to play"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. 🎲 LUDO-STYLE DICE LUCK MODE (WITH SMART AI & 2P TOGGLE)    */}
      {/* ============================================================== */}
      <section id="dice-mode" className="w-full max-w-5xl px-6 py-10 scroll-mt-20">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-amber-50/70 via-white to-amber-50/40 border-2 border-amber-200/80 shadow-md relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-200/80">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                <FaDice className="text-sm" />
                <span>Mode 2: Dice Mode • 100% Luck</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Roll of Fate: Dice Mode (লুডু ডাইস মোড)
              </h2>
              <p className="text-slate-600 text-sm mt-1.5 max-w-2xl leading-relaxed">
                ডাইস রোল করে <strong>১ থেকে ৯</strong> এর মধ্যে নম্বর তুলুন। ঘর ফাঁকা থাকলে আপনার, কিন্তু আগে থেকেই পূর্ণ থাকলে <strong>চাল মিস (Turn Missed)</strong>! এখন এআই-এর বিরুদ্ধেও খেলা যাবে!
              </p>
            </div>

            {/* Toggle: vs AI or 2P */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start sm:self-center">
              <button
                onClick={() => {
                  setDiceModeVsAI(true);
                  handleResetDiceGame();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  diceModeVsAI
                    ? "bg-amber-500 text-slate-950 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FaRobot className="text-sm" />
                <span>Play vs Smart AI</span>
              </button>
              <button
                onClick={() => {
                  setDiceModeVsAI(false);
                  handleResetDiceGame();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !diceModeVsAI
                    ? "bg-amber-500 text-slate-950 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>👥 2-Player Local</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-8">
            {/* Left: 9-Numbered Visual Grid */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center">
              <div className="p-3 sm:p-4 rounded-2xl bg-amber-100/60 border border-amber-200 shadow-inner">
                <div className="grid grid-cols-3 gap-2.5">
                  {diceBoard.map((val, idx) => {
                    const cellNumber = idx + 1;
                    const isWinningCell = winningLine && winningLine.includes(idx);
                    const isLastTarget = lastTargetIndex === idx;

                    return (
                      <div
                        key={idx}
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex flex-col items-center justify-center relative transition-all duration-300 select-none ${
                          isWinningCell
                            ? "ring-4 ring-emerald-500 scale-105 z-10 shadow-lg"
                            : isLastTarget
                            ? "ring-2 ring-amber-400 shadow-md"
                            : ""
                        } ${
                          val === "X"
                            ? "bg-rose-100/90 text-rose-600 border-2 border-rose-300"
                            : val === "O"
                            ? "bg-amber-100/90 text-amber-700 border-2 border-amber-300"
                            : "bg-white border-2 border-dashed border-amber-200/90 text-slate-400"
                        }`}
                      >
                        <span
                          className={`absolute top-1.5 left-2 text-[11px] font-black font-mono ${
                            val === "X"
                              ? "text-rose-400"
                              : val === "O"
                              ? "text-amber-500"
                              : "text-amber-700/60"
                          }`}
                        >
                          #{cellNumber}
                        </span>

                        {val === "X" && (
                          <div className="flex flex-col items-center mt-1">
                            <GiFox className="text-3xl text-rose-600" />
                            <span className="text-[10px] font-bold text-rose-700">You (Fox)</span>
                          </div>
                        )}
                        {val === "O" && (
                          <div className="flex flex-col items-center mt-1">
                            {diceModeVsAI ? (
                              <FaRobot className="text-3xl text-amber-600" />
                            ) : (
                              <GiLion className="text-3xl text-amber-600" />
                            )}
                            <span className="text-[10px] font-bold text-amber-800">
                              {diceModeVsAI ? "Bot (🤖)" : "P2 (Lion)"}
                            </span>
                          </div>
                        )}
                        {!val && (
                          <div className="text-center">
                            <span className="text-2xl font-black text-amber-300/80">
                              {cellNumber}
                            </span>
                            <span className="block text-[9px] text-slate-400 font-medium">Free</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-6 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-md bg-rose-200 border border-rose-300" />
                  <span>You: Fox (X)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-md bg-amber-200 border border-amber-300" />
                  <span>{diceModeVsAI ? "Smart Bot: (O)" : "Player 2: Lion (O)"}</span>
                </div>
              </div>
            </div>

            {/* Right: Interactive 3D Dice Roller */}
            <div className="lg:col-span-5 flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-amber-200 shadow-sm">
              <div className="w-full pb-4 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Active Turn:
                </span>
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-xs ${
                    diceTurn === "X"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : "bg-amber-50 text-amber-800 border border-amber-200"
                  }`}
                >
                  {diceTurn === "X" ? (
                    <GiFox className="text-base" />
                  ) : diceModeVsAI ? (
                    <FaRobot className="text-base" />
                  ) : (
                    <GiLion className="text-base" />
                  )}
                  <span>
                    {diceTurn === "X"
                      ? "Your Turn (Fox 🦊)"
                      : diceModeVsAI
                      ? "Smart Bot's Turn 🤖"
                      : "Player 2's Turn (Lion 🦁)"}
                  </span>
                </div>
              </div>

              <div className="my-6 flex flex-col items-center">
                <div
                  onClick={() => {
                    if (diceModeVsAI && diceTurn === "O") return;
                    handleRollDice();
                  }}
                  className={`w-28 h-28 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 shadow-lg shadow-amber-500/30 border-4 border-amber-200 flex flex-col items-center justify-center text-white select-none transition-all ${
                    isRolling
                      ? "animate-dice-shake scale-110"
                      : diceModeVsAI && diceTurn === "O"
                      ? "cursor-wait opacity-90"
                      : "cursor-pointer hover:scale-105 active:scale-95"
                  } ${diceWinner ? "opacity-75 cursor-not-allowed" : ""}`}
                  title={diceModeVsAI && diceTurn === "O" ? "Bot is rolling..." : "Click to Roll Dice!"}
                >
                  <span className="text-5xl font-black drop-shadow-sm font-mono">
                    {displayDiceNum !== null ? displayDiceNum : "?"}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider opacity-90 mt-0.5">
                    {isRolling ? "Rolling..." : "Dice (1-9)"}
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  {diceModeVsAI && diceTurn === "O"
                    ? "🤖 Bot is rolling automatically..."
                    : "Tap dice or click button below to roll"}
                </p>
              </div>

              <button
                onClick={handleRollDice}
                disabled={isRolling || !!diceWinner || (diceModeVsAI && diceTurn === "O")}
                className={`w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-black text-sm shadow-sm transition-all ${
                  diceWinner
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : isRolling
                    ? "bg-amber-300 text-slate-800 cursor-wait"
                    : diceModeVsAI && diceTurn === "O"
                    ? "bg-amber-100 text-amber-800 border border-amber-300 cursor-wait"
                    : diceTurn === "X"
                    ? "bg-rose-600 hover:bg-rose-700 text-white cursor-pointer active:scale-98 shadow-rose-600/20"
                    : "bg-amber-500 hover:bg-amber-600 text-slate-950 cursor-pointer active:scale-98 shadow-amber-500/20"
                }`}
              >
                <FaDice className={`text-lg ${isRolling ? "animate-spin" : ""}`} />
                <span>
                  {isRolling
                    ? "Rolling Dice..."
                    : diceWinner
                    ? "Game Finished"
                    : diceModeVsAI && diceTurn === "O"
                    ? "🤖 Smart Bot is Rolling..."
                    : `Roll Dice for ${diceTurn === "X" ? "Your Move (Fox)" : "Player 2 (Lion)"}`}
                </span>
              </button>

              <div
                className={`w-full mt-4 p-3 rounded-xl text-xs font-bold transition-all text-left ${
                  diceMessage.type === "miss"
                    ? "bg-rose-50 border border-rose-200 text-rose-800 animate-bounce"
                    : diceMessage.type === "win"
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                    : diceMessage.type === "draw"
                    ? "bg-amber-100 border border-amber-300 text-amber-900"
                    : diceMessage.type === "hit"
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                    : "bg-slate-50 border border-slate-200 text-slate-600"
                }`}
              >
                {diceMessage.text}
              </div>

              {/* Reset Button */}
              <div className="w-full mt-3 flex items-center justify-between">
                <button
                  onClick={handleResetDiceGame}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <HiMiniArrowPath className="text-sm" />
                  <span>Reset Dice Game</span>
                </button>
              </div>

              {rollHistory.length > 0 && (
                <div className="w-full mt-3 pt-3 border-t border-slate-100 flex items-center justify-start gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400 font-semibold mr-1">Last rolls:</span>
                  {rollHistory.map((item, i) => (
                    <span
                      key={i}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                        item.status === "miss"
                          ? "bg-rose-100 text-rose-700 border border-rose-200 line-through"
                          : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      }`}
                      title={item.status === "miss" ? "Turn Missed!" : "Claimed!"}
                    >
                      {item.player === "X" ? "You" : diceModeVsAI ? "Bot" : "P2"}: #{item.roll}{" "}
                      {item.status === "miss" ? "❌" : "✓"}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. ⏳ VANISHING MODE (WITH SMART AI & 2P TOGGLE)               */}
      {/* ============================================================== */}
      <section id="vanishing-mode" className="w-full max-w-5xl px-6 py-10 scroll-mt-20">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-indigo-50/80 via-white to-indigo-50/40 border-2 border-indigo-200 shadow-md relative overflow-hidden">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-indigo-200/80">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
                <PiHourglassFill className="text-sm" />
                <span>Mode 3: Vanishing Mode • 3 Pieces Max • Never Draws</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Vanishing Mode (ভ্যানিশিং মোড: ৩-গুটি লড়াই)
              </h2>
              <p className="text-slate-600 text-sm mt-1.5 max-w-2xl leading-relaxed">
                বোর্ডে প্রতিটি খেলোয়াড়ের সর্বোচ্চ <strong>৩টি গুটি</strong> থাকতে পারবে! যখন আপনি আপনার <strong>৪র্থ চালটি</strong> দিবেন, আপনার <strong>১ম গুটিটি স্বয়ংক্রিয়ভাবে মুছে (Vanish)</strong> যাবে। তাই এখানে কোনো ম্যাচ ড্র হয় না!
              </p>
            </div>

            {/* Mode Switcher: vs AI or 2P */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start sm:self-center">
              <button
                onClick={() => {
                  setVanishModeVsAI(true);
                  handleResetVanishGame();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  vanishModeVsAI
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FaRobot className="text-sm" />
                <span>Play vs Smart AI</span>
              </button>

              <button
                onClick={() => {
                  setVanishModeVsAI(false);
                  handleResetVanishGame();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !vanishModeVsAI
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>👥 2-Player Local</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-8">
            {/* Left Column: The 3x3 Dynamic Grid */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center">
              {/* Player Pieces Counters */}
              <div className="w-full max-w-sm mb-4 flex items-center justify-between text-xs font-semibold px-2">
                <div className="flex items-center gap-2">
                  <span className="text-rose-600 font-bold">You (Fox 🦊):</span>
                  <div className="flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full transition-all ${
                          i < vanishP1Moves.length
                            ? "bg-rose-500 scale-100"
                            : "bg-slate-200 scale-90"
                        }`}
                        title={`${vanishP1Moves.length}/3 pieces on board`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ({vanishP1Moves.length}/3)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-indigo-700 font-bold">
                    {vanishModeVsAI ? "Smart Bot 🤖:" : "P2 (Lion 🦁):"}
                  </span>
                  <div className="flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full transition-all ${
                          i < vanishP2Moves.length
                            ? "bg-indigo-500 scale-100"
                            : "bg-slate-200 scale-90"
                        }`}
                        title={`${vanishP2Moves.length}/3 pieces on board`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ({vanishP2Moves.length}/3)
                  </span>
                </div>
              </div>

              {/* The 3x3 Vanishing Board */}
              <div className="p-3 sm:p-4 rounded-2xl bg-indigo-100/50 border border-indigo-200 shadow-inner">
                <div className="grid grid-cols-3 gap-2.5">
                  {vanishBoard.map((val, idx) => {
                    const isWinningCell = vanishWinningLine && vanishWinningLine.includes(idx);
                    const isP1Oldest = vanishP1Moves.length === 3 && vanishP1Moves[0] === idx;
                    const isP2Oldest = vanishP2Moves.length === 3 && vanishP2Moves[0] === idx;
                    const willVanishOnCurrentTurn =
                      (vanishTurn === "X" && isP1Oldest) || (vanishTurn === "O" && isP2Oldest);

                    return (
                      <button
                        key={idx}
                        onClick={() => handleVanishCellClick(idx)}
                        disabled={
                          !!vanishWinner ||
                          isAiThinking ||
                          (val !== null && !willVanishOnCurrentTurn)
                        }
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex flex-col items-center justify-center relative transition-all duration-200 select-none ${
                          isWinningCell
                            ? "ring-4 ring-emerald-500 scale-105 z-10 shadow-lg"
                            : willVanishOnCurrentTurn
                            ? "ring-3 ring-dashed ring-amber-500 opacity-75 animate-pulse scale-[0.98]"
                            : ""
                        } ${
                          val === "X"
                            ? isP1Oldest
                              ? "bg-rose-100/70 border-2 border-dashed border-rose-400"
                              : "bg-rose-100 text-rose-600 border-2 border-rose-300 shadow-xs"
                            : val === "O"
                            ? isP2Oldest
                              ? "bg-indigo-100/70 border-2 border-dashed border-indigo-400"
                              : "bg-indigo-100 text-indigo-700 border-2 border-indigo-300 shadow-xs"
                            : "bg-white hover:bg-slate-50 border border-slate-300 shadow-xs hover:border-indigo-400 cursor-pointer"
                        }`}
                      >
                        {willVanishOnCurrentTurn && (
                          <span className="absolute top-1 text-[9px] font-black uppercase tracking-tight text-amber-800 bg-amber-200/90 px-1.5 py-0.5 rounded-full">
                            ⏳ Vanishes next
                          </span>
                        )}

                        {val === "X" && (
                          <div className="flex flex-col items-center">
                            <GiFox className="text-3xl text-rose-600" />
                            <span className="text-[10px] font-bold text-rose-700">Fox (X)</span>
                          </div>
                        )}
                        {val === "O" && (
                          <div className="flex flex-col items-center">
                            {vanishModeVsAI ? (
                              <FaRobot className="text-3xl text-indigo-600" />
                            ) : (
                              <GiLion className="text-3xl text-amber-600" />
                            )}
                            <span className="text-[10px] font-bold text-indigo-800">
                              {vanishModeVsAI ? "Bot (O)" : "Lion (O)"}
                            </span>
                          </div>
                        )}
                        {!val && <span className="text-slate-300 text-base">·</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-500 text-center">
                {vanishP1Moves.length === 3 || vanishP2Moves.length === 3 ? (
                  <span className="text-amber-700 font-semibold">
                    💡 ড্যাশ-বর্ডার যুক্ত ঘরটি পরবর্তী চালে স্বয়ংক্রিয়ভাবে মুছে যাবে!
                  </span>
                ) : (
                  <span>৩টি গুটি পূর্ণ হওয়ার পর নতুন চাল দিলে ১ম গুটিটি মুছে যাবে</span>
                )}
              </p>
            </div>

            {/* Right Column: AI Status, Live Banner & Actions */}
            <div className="lg:col-span-5 flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-indigo-200 shadow-sm">
              <div className="w-full pb-4 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Current Turn:
                </span>
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-xs ${
                    vanishTurn === "X"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : "bg-indigo-50 text-indigo-800 border border-indigo-200"
                  }`}
                >
                  {vanishTurn === "X" ? (
                    <GiFox className="text-base" />
                  ) : vanishModeVsAI ? (
                    <FaRobot className="text-base" />
                  ) : (
                    <GiLion className="text-base" />
                  )}
                  <span>
                    {vanishTurn === "X"
                      ? "Your Turn (Fox 🦊)"
                      : vanishModeVsAI
                      ? isAiThinking
                        ? "🤖 Bot Thinking..."
                        : "Smart Bot's Turn"
                      : "Player 2 (Lion 🦁)"}
                  </span>
                </div>
              </div>

              <div className="my-5 w-full flex flex-col items-center">
                {vanishWinner ? (
                  <div className="p-4 w-full rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                    <span className="text-3xl block mb-1">🎉</span>
                    <h3 className="font-extrabold text-base">
                      {vanishWinner === "X"
                        ? "Congratulations! You Won!"
                        : vanishModeVsAI
                        ? "Smart Bot Claimed Victory!"
                        : "Player 2 (Lion) Won!"}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Matched 3 in a row under the 3-pieces vanishing rule in {vanishMoveCount} total moves!
                    </p>
                  </div>
                ) : (
                  <div className="p-4 w-full rounded-2xl bg-slate-50 border border-slate-200 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">Opponent Type:</span>
                      <span className="text-xs font-bold text-indigo-700">
                        {vanishModeVsAI ? "🤖 Smart AI Heuristic" : "👥 Local 2P"}
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">Total Moves Made:</span>
                      <span className="text-xs font-mono font-bold text-slate-800">
                        {vanishMoveCount} moves
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">Rule Status:</span>
                      <span className="text-xs font-semibold text-emerald-700">
                        ✓ Draws are Impossible
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full flex items-center gap-3">
                <button
                  onClick={handleResetVanishGame}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <HiMiniArrowPath className="text-base" />
                  <span>{vanishWinner ? "Play Again" : "Reset Vanish Game"}</span>
                </button>
              </div>

              <div className="w-full mt-4 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-left text-xs text-amber-900 leading-relaxed">
                <span className="font-bold block mb-0.5">🧠 Pro Vanishing Tip:</span>
                Don't just watch your opponent's pieces—watch which of their pieces will vanish next!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How To Play Section */}
      <section id="how-to-play" className="w-full max-w-5xl px-6 py-14 scroll-mt-20">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Simple Rules</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-1">How It Works</h2>
          <p className="text-slate-600 text-sm mt-2">
            Play against friends or test yourself against our Smart AI in 3 simple steps:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-left">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm mb-4">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">Choose Mode & Opponent</h3>
            <p className="text-slate-600 text-sm mt-1.5 leading-relaxed">
              Play Classical, roll the Dice for luck, or try Vanishing Mode. Switch between Smart AI and Local 2-Player with 1 tap!
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-left">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm mb-4">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">Make Your Moves</h3>
            <p className="text-slate-600 text-sm mt-1.5 leading-relaxed">
              Place your totem, roll the 9-sided dice, or manage your 3 vanishing pieces to outmaneuver the AI.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-left">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm mb-4">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">Line Up Three</h3>
            <p className="text-slate-600 text-sm mt-1.5 leading-relaxed">
              Connect 3 squares in a row horizontally, vertically, or diagonally to take the victory!
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="w-full max-w-5xl px-6 py-14 scroll-mt-20">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Features</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-1">Why You Will Love Playing</h2>
          <p className="text-slate-600 text-sm mt-2">
            Packed with 3 distinct game modes, smart AI heuristics, and zero ads.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-left">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl mb-3">
              <FaRobot />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Smart AI in All Modes</h4>
            <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">
              Classical, Dice, and Vanishing modes all feature instant AI bot play so you can always enjoy a game alone!
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl mb-3">
              <FaDice />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Dice Luck Mode</h4>
            <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">
              Roll 1 to 9 for a game of pure fortune! Occupied squares cause a missed turn, keeping the match tense.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-left">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl mb-3">
              <PiHourglassFill />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Vanishing (No-Draw)</h4>
            <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">
              Max 3 pieces per player. Your 4th move deletes your 1st move, making draws mathematically impossible!
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl mb-3">
              <PiCoinsFill />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Fair Coin Flip</h4>
            <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">
              No disputes about who starts first. The random toss gives both players a 50/50 fair chance.
            </p>
          </div>
        </div>
      </section>

      {/* Fun Facts / Trivia Section */}
      <section id="trivia" className="w-full max-w-5xl px-6 py-14 scroll-mt-20">
        <div className="p-8 sm:p-10 rounded-2xl bg-amber-50/60 border border-amber-200/80 shadow-xs text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-amber-200">
            <div className="flex items-center gap-2">
              <PiLightbulbFill className="text-amber-500 text-2xl" />
              <h3 className="font-bold text-slate-900 text-lg sm:text-xl">
                Did You Know? Tic Tac Toe Trivia
              </h3>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-slate-500 font-medium mr-1">
                Fact {triviaIndex + 1} of {infoData.length}
              </span>
              <button
                onClick={prevTrivia}
                className="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer"
                title="Previous Fact"
              >
                <FaChevronLeft className="text-xs" />
              </button>
              <button
                onClick={nextTrivia}
                className="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer"
                title="Next Fact"
              >
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-start gap-5">
            <div className="w-12 h-12 rounded-xl bg-white border border-amber-200 text-amber-600 flex items-center justify-center text-2xl shrink-0 shadow-xs">
              {currentTrivia && <currentTrivia.icon />}
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900">
                {currentTrivia?.title}
              </h4>
              <p className="mt-1.5 text-slate-700 text-sm leading-relaxed max-w-2xl">
                {currentTrivia?.info}
              </p>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="mt-6 flex items-center gap-1.5">
            {infoData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setTriviaIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === triviaIndex ? "w-6 bg-amber-500" : "w-2 bg-amber-200 hover:bg-amber-300"
                }`}
                title={`Jump to fact ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="w-full max-w-4xl px-6 py-12">
        <div className="p-8 sm:p-12 rounded-3xl bg-indigo-50 border border-indigo-100 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Ready for a match?
          </h2>
          <p className="mt-2 text-slate-600 text-sm max-w-md mx-auto">
            Play against our Smart AI or grab a friend sitting next to you. All modes are 100% free with no registration.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#demo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <FaRobot className="text-base" />
              <span>Classical vs AI</span>
            </a>
            <a
              href="#dice-mode"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-sm shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <FaDice className="text-base" />
              <span>Dice Luck vs AI</span>
            </a>
            <a
              href="#vanishing-mode"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-100 hover:bg-indigo-200 border border-indigo-300 text-indigo-900 font-bold text-sm shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <PiHourglassFill className="text-base text-indigo-700" />
              <span>Vanishing vs AI</span>
            </a>
          </div>
        </div>
      </section>

      {/* Simple, Clean Footer */}
      <footer className="w-full border-t border-slate-200 py-8 px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 max-w-5xl">
        <div className="flex items-center gap-2">
          <TbTicTac className="text-indigo-600 text-base" />
          <span className="font-semibold text-slate-700">Tic Tac Toe</span>
          <span>•</span>
          <span>Classical AI, Dice Luck AI & Vanishing AI Modes</span>
        </div>
        <div className="mt-3 sm:mt-0 flex items-center gap-5">
          <a href="#demo" className="hover:text-slate-700 transition-colors">
            Classical AI
          </a>
          <a href="#dice-mode" className="hover:text-slate-700 transition-colors">
            Dice AI 🎲
          </a>
          <a href="#vanishing-mode" className="hover:text-slate-700 transition-colors">
            Vanishing AI ⏳
          </a>
          <button onClick={handleOpenModal} className="text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer">
            Full Game
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Home;
