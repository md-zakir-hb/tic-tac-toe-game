import { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaDice, FaPlay, FaRobot, FaTrophy } from "react-icons/fa";
import { PiGameControllerFill, PiHourglassFill, PiLightbulbFill, PiTimerFill } from "react-icons/pi";
import { TbTicTac } from "react-icons/tb";
import { useGameStore } from "../store/useGameStore";
import { infoData } from "../utils/infoData.js";
import { playTapSound } from "../utils/soundEffects";

const Lobby = () => {
  const { setActiveMode, setIsModalOpen, scores, resetScores } = useGameStore();
  const [triviaIndex, setTriviaIndex] = useState(0);

  const nextTrivia = () => {
    playTapSound();
    setTriviaIndex((prev) => (prev + 1) % infoData.length);
  };

  const prevTrivia = () => {
    playTapSound();
    setTriviaIndex((prev) => (prev - 1 + infoData.length) % infoData.length);
  };

  const currentTrivia = infoData[triviaIndex];

  // Cumulative matches and wins
  const totalGamesPlayed =
    scores.classical.player + scores.classical.ai + scores.classical.draws +
    scores.dice.player + scores.dice.ai + scores.dice.draws +
    scores.vanishing.player + scores.vanishing.ai +
    scores.custom.player1 + scores.custom.player2 + scores.custom.draws;

  const totalPlayerWins =
    scores.classical.player + scores.dice.player + scores.vanishing.player + scores.custom.player1;

  const handleLaunchMode = (mode) => {
    playTapSound();
    if (mode === "custom") {
      setIsModalOpen(true);
    } else {
      setActiveMode(mode);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-start text-slate-100">
      {/* 3D Esports Banner Hero Section */}
      <header className="w-full max-w-5xl px-4 sm:px-6 pt-6 pb-10 flex flex-col items-center text-center">
        {/* Top Tagline */}
        <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-black tracking-[0.25em] text-purple-400 uppercase mb-4 drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]">
          <span>CLEAN</span>
          <span className="text-purple-600">|</span>
          <span>TACTICAL 3D</span>
          <span className="text-purple-600">|</span>
          <span>SMART AI</span>
          <span className="text-purple-600">|</span>
          <span>NO-DRAW BLITZ</span>
        </div>

        {/* 3D Glowing Cyberpunk Banner */}
        <div className="w-full rounded-3xl cyber-neon-border relative overflow-hidden bg-gradient-to-r from-[#0d091e] via-[#140d30] to-[#0a0718] p-6 sm:p-10 shadow-[0_0_60px_rgba(168,85,247,0.4)]">
          {/* Subtle Cyber Perspective Grid & Ambient Flare */}
          <div className="absolute inset-0 cyber-rays-pattern opacity-50 pointer-events-none" />
          <div className="absolute top-1/2 right-[20%] -translate-y-1/2 w-96 h-96 bg-purple-600/30 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-[20%] w-64 h-64 bg-cyan-600/20 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: 3D Typography & Actions */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* 3D Layered Typography */}
              <div className="select-none">
                <span className="inline-block text-4xl sm:text-6xl md:text-7xl font-black italic tracking-tighter text-3d-yellow leading-none">
                  TIC TAC
                </span>
                <span className="block text-4xl sm:text-6xl md:text-7xl font-black italic tracking-tighter text-3d-purple leading-none mt-1 sm:mt-2">
                  ARENA 3D
                </span>
              </div>

              {/* Subtitle */}
              <p className="mt-4 text-xs sm:text-sm text-purple-200/80 max-w-lg leading-relaxed font-medium drop-shadow-xs">
                Step into the futuristic battleground. Duel our <strong>Smart AI Bot</strong> with real-time heuristic defense, roll the <strong>9-sided dice of fate</strong>, or conquer the <strong>vanishing blitz</strong> with zero draws.
              </p>

              {/* Tactical Spec Tags */}
              <div className="mt-5 flex flex-wrap items-center gap-2 text-[10px] sm:text-xs font-bold text-purple-300">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-950/80 border border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                  🎮 4 Game Modes
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-950/80 border border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                  🤖 Smart AI Opponent
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-950/80 border border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                  ⚡ 100% Free • No Ads
                </span>
              </div>

              {/* Hero Action Buttons */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleLaunchMode("classical")}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm tracking-wider uppercase neon-glow-btn cursor-pointer active:scale-95"
                >
                  <FaPlay className="text-xs" />
                  <span>Enter Arena (Quick Play)</span>
                </button>

                <button
                  onClick={() => handleLaunchMode("dice")}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/60 text-amber-300 font-bold text-xs sm:text-sm tracking-wide transition-all shadow-[0_0_15px_rgba(250,204,21,0.25)] cursor-pointer active:scale-95"
                >
                  <FaDice className="text-base" />
                  <span>Dice of Fate</span>
                </button>

                <button
                  onClick={() => handleLaunchMode("vanishing")}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/60 text-rose-300 font-bold text-xs sm:text-sm tracking-wide transition-all shadow-[0_0_15px_rgba(244,63,94,0.25)] cursor-pointer active:scale-95"
                >
                  <PiHourglassFill className="text-base" />
                  <span>Vanishing Blitz</span>
                </button>
              </div>
            </div>

            {/* Right Column: 3D Tactical Character */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              {/* Outer Glow Halo */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-purple-600/40 via-cyan-500/20 to-transparent rounded-3xl blur-2xl pointer-events-none" />

              <div className="relative rounded-2xl overflow-hidden border-2 border-purple-500/60 shadow-[0_0_40px_rgba(168,85,247,0.5)] group max-w-[340px] sm:max-w-[380px]">
                <img
                  src="/hero-character.jpg"
                  alt="3D Tactical Cyberpunk Character"
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                />

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d091e] via-transparent to-transparent opacity-60" />

                {/* Cyber HUD Badge */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-purple-500/40 text-[11px] font-bold text-purple-200">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    AI BOT ONLINE
                  </span>
                  <span className="text-purple-400 font-mono">TACTICAL 3D</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Script Accent Subtitle & Neon Order-Style Pill */}
        <div className="mt-8 flex flex-col items-center">
          <p className="font-['Outfit'] italic text-purple-400 font-bold text-lg sm:text-xl drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]">
            Next-Gen Tactical Experience
          </p>

          <button
            onClick={() => handleLaunchMode("classical")}
            className="mt-3 px-8 py-3 rounded-2xl bg-purple-950/70 hover:bg-purple-900 border-2 border-purple-500 hover:border-purple-400 text-purple-100 font-black text-xs sm:text-sm tracking-widest uppercase transition-all shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:shadow-[0_0_50px_rgba(168,85,247,0.95)] cursor-pointer active:scale-95 flex items-center gap-2"
          >
            <TbTicTac className="text-lg text-purple-300" />
            <span>PLAY ARENA NOW!</span>
          </button>

          {/* Quick Mode Links */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-bold text-purple-300/70 uppercase tracking-wider">
            <button
              onClick={() => handleLaunchMode("classical")}
              className="hover:text-purple-200 transition-colors cursor-pointer"
            >
              Classical 3x3
            </button>
            <span className="text-purple-700">•</span>
            <button
              onClick={() => handleLaunchMode("dice")}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Dice of Fate
            </button>
            <span className="text-purple-700">•</span>
            <button
              onClick={() => handleLaunchMode("vanishing")}
              className="hover:text-rose-300 transition-colors cursor-pointer"
            >
              Vanishing Blitz
            </button>
            <span className="text-purple-700">•</span>
            <button
              onClick={() => handleLaunchMode("custom")}
              className="hover:text-emerald-300 transition-colors cursor-pointer"
            >
              Custom Timed PvP
            </button>
          </div>

          {/* Global Stats Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 bg-slate-900/60 border border-purple-500/30 px-5 py-2.5 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.5)] text-xs font-semibold text-purple-200/80 backdrop-blur-md">
            <div className="flex items-center gap-1.5">
              <span className="text-purple-400 font-black">{totalGamesPlayed}</span>
              <span>Matches Played</span>
            </div>
            <span className="text-purple-800">•</span>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <FaTrophy className="text-amber-400" />
              <span className="font-black">{totalPlayerWins}</span>
              <span>Total Player Victories</span>
            </div>
            {totalGamesPlayed > 0 && (
              <>
                <span className="text-purple-800">•</span>
                <button
                  onClick={() => {
                    playTapSound();
                    resetScores();
                  }}
                  className="text-[11px] text-purple-400/60 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Reset Stats
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 4 Game Modes Grid */}
      <section className="w-full max-w-5xl px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Select Game Mode</h2>
            <p className="text-xs sm:text-sm text-purple-300/70">Pick how you want to challenge the board</p>
          </div>
          <span className="text-xs font-bold text-purple-300 bg-purple-950/60 border border-purple-500/40 px-3.5 py-1 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            4 Modes Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 1. Classical Mode Card */}
          <div className="group bg-slate-900/70 hover:bg-slate-900/90 border border-purple-500/30 hover:border-purple-400 rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.5)] hover:shadow-[0_0_35px_rgba(168,85,247,0.3)] transition-all duration-200 flex flex-col justify-between text-left relative overflow-hidden backdrop-blur-md">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-950/80 group-hover:bg-purple-600 text-purple-400 group-hover:text-white flex items-center justify-center text-2xl transition-colors border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  <FaRobot />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 bg-purple-950/80 px-2.5 py-1 rounded-lg border border-purple-500/40">
                  Mode 1 • Standard
                </span>
              </div>

              <h3 className="text-xl font-black text-white group-hover:text-purple-300 transition-colors">
                Classical 3x3 Arena
              </h3>
              <p className="text-purple-200/70 text-xs sm:text-sm mt-2 leading-relaxed">
                The authentic tactical 3-in-a-row experience. Features a heuristic Smart AI Bot that blocks your moves, or local 2-player pass-and-play.
              </p>

              {/* Mode Score Snapshot */}
              <div className="mt-4 flex items-center gap-3 text-xs font-medium text-purple-300/80 bg-purple-950/40 p-2.5 rounded-xl border border-purple-500/20">
                <span>Record:</span>
                <span className="text-emerald-400 font-bold">You: {scores.classical.player}</span>
                <span>•</span>
                <span className="text-purple-300 font-bold">AI: {scores.classical.ai}</span>
                <span>•</span>
                <span>Draws: {scores.classical.draws}</span>
              </div>
            </div>

            <button
              onClick={() => handleLaunchMode("classical")}
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all cursor-pointer active:scale-98"
            >
              <FaPlay className="text-xs" />
              <span>Play Classical Arena</span>
            </button>
          </div>

          {/* 2. Dice Luck Mode Card */}
          <div className="group bg-slate-900/70 hover:bg-slate-900/90 border border-amber-500/30 hover:border-amber-400 rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.5)] hover:shadow-[0_0_35px_rgba(250,204,21,0.25)] transition-all duration-200 flex flex-col justify-between text-left relative overflow-hidden backdrop-blur-md">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-950/80 group-hover:bg-amber-500 text-amber-400 group-hover:text-slate-950 flex items-center justify-center text-2xl transition-colors border border-amber-500/40 shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                  <FaDice />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-500/40">
                  Mode 2 • 100% Luck
                </span>
              </div>

              <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors">
                Roll of Fate (Dice Mode)
              </h3>
              <p className="text-purple-200/70 text-xs sm:text-sm mt-2 leading-relaxed">
                Roll a 9-sided dice for your spot! If the spot is free, claim it. If it is already occupied, your turn is skipped! High suspense and dramatic finishes.
              </p>

              {/* Mode Score Snapshot */}
              <div className="mt-4 flex items-center gap-3 text-xs font-medium text-amber-300/80 bg-amber-950/30 p-2.5 rounded-xl border border-amber-500/20">
                <span>Record:</span>
                <span className="text-emerald-400 font-bold">You: {scores.dice.player}</span>
                <span>•</span>
                <span className="text-amber-400 font-bold">AI: {scores.dice.ai}</span>
                <span>•</span>
                <span>Draws: {scores.dice.draws}</span>
              </div>
            </div>

            <button
              onClick={() => handleLaunchMode("dice")}
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(250,204,21,0.4)] transition-all cursor-pointer active:scale-98"
            >
              <FaDice className="text-base" />
              <span>Play Dice Luck</span>
            </button>
          </div>

          {/* 3. Vanishing Mode Card */}
          <div className="group bg-slate-900/70 hover:bg-slate-900/90 border border-rose-500/30 hover:border-rose-400 rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.5)] hover:shadow-[0_0_35px_rgba(244,63,94,0.25)] transition-all duration-200 flex flex-col justify-between text-left relative overflow-hidden backdrop-blur-md">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-950/80 group-hover:bg-rose-600 text-rose-400 group-hover:text-white flex items-center justify-center text-2xl transition-colors border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                  <PiHourglassFill />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300 bg-rose-950/80 px-2.5 py-1 rounded-lg border border-rose-500/40">
                  Mode 3 • Never Draws
                </span>
              </div>

              <h3 className="text-xl font-black text-white group-hover:text-rose-400 transition-colors">
                Vanishing Blitz (3 Pieces Max)
              </h3>
              <p className="text-purple-200/70 text-xs sm:text-sm mt-2 leading-relaxed">
                Players can only have 3 pieces on the board at a time. Placing your 4th piece automatically removes your 1st piece, creating an infinite tactical cycle where ties are impossible!
              </p>

              {/* Mode Score Snapshot */}
              <div className="mt-4 flex items-center gap-3 text-xs font-medium text-rose-300/80 bg-rose-950/30 p-2.5 rounded-xl border border-rose-500/20">
                <span>Record:</span>
                <span className="text-emerald-400 font-bold">You: {scores.vanishing.player}</span>
                <span>•</span>
                <span className="text-rose-400 font-bold">AI: {scores.vanishing.ai}</span>
                <span>•</span>
                <span className="text-purple-400/60">Draws: 0 (Impossible)</span>
              </div>
            </div>

            <button
              onClick={() => handleLaunchMode("vanishing")}
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all cursor-pointer active:scale-98"
            >
              <PiHourglassFill className="text-base" />
              <span>Play Vanishing Blitz</span>
            </button>
          </div>

          {/* 4. Custom Blitz Timed Match Card */}
          <div className="group bg-slate-900/70 hover:bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.5)] hover:shadow-[0_0_35px_rgba(16,185,129,0.25)] transition-all duration-200 flex flex-col justify-between text-left relative overflow-hidden backdrop-blur-md">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 group-hover:bg-emerald-600 text-emerald-400 group-hover:text-white flex items-center justify-center text-2xl transition-colors border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <PiTimerFill />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/40">
                  Mode 4 • Timed PvP
                </span>
              </div>

              <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">
                Custom Blitz Match
              </h3>
              <p className="text-purple-200/70 text-xs sm:text-sm mt-2 leading-relaxed">
                Full competitive setup: Select animal totems (Lion, Fox, Tiger, Horse), player colors, blitz chess timers (10s, 15s, 20s), animated coin tosses, and post-game move replays.
              </p>

              {/* Mode Score Snapshot */}
              <div className="mt-4 flex items-center gap-3 text-xs font-medium text-emerald-300/80 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/20">
                <span>Record:</span>
                <span className="text-emerald-400 font-bold">P1: {scores.custom.player1}</span>
                <span>•</span>
                <span className="text-purple-300 font-bold">P2: {scores.custom.player2}</span>
                <span>•</span>
                <span>Draws: {scores.custom.draws}</span>
              </div>
            </div>

            <button
              onClick={() => handleLaunchMode("custom")}
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer active:scale-98"
            >
              <PiGameControllerFill className="text-base" />
              <span>Configure & Play Blitz</span>
            </button>
          </div>
        </div>
      </section>

      {/* Quick Rules & How It Works */}
      <section className="w-full max-w-5xl px-4 sm:px-6 py-10">
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-purple-500/30 shadow-[0_0_30px_rgba(0,0,0,0.5)] text-left backdrop-blur-md">
          <div className="text-center max-w-lg mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-950/80 px-2.5 py-1 rounded-md border border-purple-500/40">
              Tactical Rules
            </span>
            <h3 className="text-2xl font-black text-white mt-2">How Each Mode Works</h3>
            <p className="text-xs sm:text-sm text-purple-300/70 mt-1">Simple mechanics for competitive play</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-purple-500/20">
              <span className="text-xs font-bold text-purple-400 block mb-1">Standard 3x3</span>
              <h4 className="font-bold text-white text-sm">Line Up Three</h4>
              <p className="text-xs text-purple-200/70 mt-1.5 leading-relaxed">
                Classic rules: Take turns placing your mark on the 3x3 grid. First player to connect 3 marks horizontally, vertically, or diagonally wins.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/20">
              <span className="text-xs font-bold text-amber-400 block mb-1">Dice Luck</span>
              <h4 className="font-bold text-white text-sm">Roll of the Numbers</h4>
              <p className="text-xs text-amber-200/70 mt-1.5 leading-relaxed">
                Roll the 9-sided die. If the rolled square is empty, you claim it. If it is already claimed, you forfeit your turn!
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/20">
              <span className="text-xs font-bold text-rose-400 block mb-1">Vanishing Blitz</span>
              <h4 className="font-bold text-white text-sm">3 Pieces Max Rule</h4>
              <p className="text-xs text-rose-200/70 mt-1.5 leading-relaxed">
                Only 3 pieces can exist on the board per player. The 4th move erases your oldest move, guaranteeing someone wins!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tic Tac Toe Trivia Carousel */}
      <section className="w-full max-w-5xl px-4 sm:px-6 py-6 pb-12">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-amber-500/30 shadow-[0_0_30px_rgba(0,0,0,0.5)] text-left backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/30">
            <div className="flex items-center gap-2">
              <PiLightbulbFill className="text-amber-400 text-2xl shrink-0 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]" />
              <div>
                <h3 className="font-bold text-white text-base sm:text-lg">
                  Did You Know? Tic Tac Toe Trivia
                </h3>
                <p className="text-[11px] text-amber-300/70">Historical & mathematical facts about the game</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-purple-300/70 font-medium mr-1">
                Fact {triviaIndex + 1} of {infoData.length}
              </span>
              <button
                onClick={prevTrivia}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 border border-purple-500/30 text-purple-200 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                title="Previous Fact"
              >
                <FaChevronLeft className="text-xs" />
              </button>
              <button
                onClick={nextTrivia}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 border border-purple-500/30 text-purple-200 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                title="Next Fact"
              >
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>

          <div className="pt-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center text-xl shrink-0 shadow-[0_0_15px_rgba(250,204,21,0.3)]">
              {currentTrivia && <currentTrivia.icon />}
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-amber-300">
                {currentTrivia?.title}
              </h4>
              <p className="mt-1 text-purple-200/80 text-xs sm:text-sm leading-relaxed max-w-2xl">
                {currentTrivia?.info}
              </p>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="mt-5 flex items-center gap-1.5">
            {infoData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  playTapSound();
                  setTriviaIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === triviaIndex ? "w-6 bg-amber-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]" : "w-2 bg-purple-900/80 hover:bg-purple-700"
                }`}
                title={`Jump to fact ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Clean Cyber Footer */}
      <footer className="w-full border-t border-purple-900/40 py-8 px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-purple-400/60 max-w-5xl">
        <div className="flex items-center gap-2">
          <TbTicTac className="text-purple-400 text-base" />
          <span className="font-bold text-purple-300">Tic Tac Toe Blitz Arena 3D</span>
          <span>•</span>
          <span>Cyber Esports Engine</span>
        </div>
        <div className="mt-3 sm:mt-0 flex items-center gap-4">
          <button onClick={() => handleLaunchMode("classical")} className="hover:text-purple-300 transition-colors cursor-pointer">
            Classical
          </button>
          <button onClick={() => handleLaunchMode("dice")} className="hover:text-amber-400 transition-colors cursor-pointer">
            Dice
          </button>
          <button onClick={() => handleLaunchMode("vanishing")} className="hover:text-rose-400 transition-colors cursor-pointer">
            Vanishing
          </button>
          <button onClick={() => handleLaunchMode("custom")} className="hover:text-emerald-400 transition-colors cursor-pointer">
            Custom Blitz
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Lobby;
