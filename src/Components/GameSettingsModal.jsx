import { useState } from "react";
import { FaHandPointRight } from "react-icons/fa";
import { HiMiniXMark } from "react-icons/hi2";
import { PiCoinsFill, PiGameControllerFill } from "react-icons/pi";
import { TbVs } from "react-icons/tb";
import { useGameStore } from "../store/useGameStore";
import { color } from "../utils/color";
import { icons } from "../utils/icons";
import { playTapSound } from "../utils/soundEffects";

const GameSettingsModal = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    setActiveMode,
    player1,
    setPlayer1,
    player2,
    setPlayer2,
    selectedColor1,
    setSelectedColor1,
    selectedColor2,
    setSelectedColor2,
    selectedIcon1,
    setSelectedIcon1,
    selectedIcon2,
    setSelectedIcon2,
    matchDuration,
    setMatchDuration,
    tossWinner,
    setTossWinner,
  } = useGameStore();

  const [isTossing, setIsTossing] = useState(false);

  if (!isModalOpen) return null;

  const handleTossWithAnimation = () => {
    setIsTossing(true);
    playTapSound();
    setTimeout(() => {
      const winner = Math.random() > 0.5 ? player1 || "Player 1" : player2 || "Player 2";
      setTossWinner(winner);
      setIsTossing(false);
    }, 450);
  };

  const handleStartMatch = () => {
    playTapSound();
    // Default to Player 1 if coin toss was skipped
    if (!tossWinner) {
      setTossWinner(player1 || "Player 1");
    }
    setIsModalOpen(false);
    setActiveMode("custom");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#0d091e] border-2 border-purple-500/80 shadow-[0_0_60px_rgba(168,85,247,0.4)] rounded-3xl p-6 sm:p-7 relative text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={() => {
            playTapSound();
            setIsModalOpen(false);
          }}
          className="absolute top-4 right-4 rounded-xl p-2 text-purple-400 hover:text-white hover:bg-purple-950/60 transition-colors cursor-pointer"
          title="Close"
        >
          <HiMiniXMark className="text-xl" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <PiGameControllerFill />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Custom Blitz Setup</h3>
            <p className="text-xs text-purple-300/70">Configure animal totems, colors, and blitz timer</p>
          </div>
        </div>

        {/* Player Names Input Section */}
        <div className="space-y-2.5 p-3.5 rounded-2xl bg-slate-950/60 border border-purple-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <label className="text-xs font-bold text-purple-300">Player 1 Name (X):</label>
            <input
              type="text"
              value={player1}
              placeholder="Player 1"
              className="bg-slate-900 border border-purple-500/40 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-white outline-none transition-all sm:w-56"
              onChange={(e) => setPlayer1(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <label className="text-xs font-bold text-purple-300">Player 2 Name (O):</label>
            <input
              type="text"
              value={player2}
              placeholder="Player 2"
              className="bg-slate-900 border border-purple-500/40 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-white outline-none transition-all sm:w-56"
              onChange={(e) => setPlayer2(e.target.value)}
            />
          </div>
        </div>

        {/* VS Indicator */}
        <div className="mt-3 w-full flex items-center justify-center gap-3 py-1.5 px-4 rounded-xl bg-slate-950/60 border border-purple-500/20 text-xs font-bold">
          <span className="text-purple-300">{player1 || "Player 1"}</span>
          <div className="w-5 h-5 rounded-full bg-purple-950 text-purple-400 border border-purple-500/40 flex items-center justify-center text-[10px]">
            <TbVs />
          </div>
          <span className="text-rose-400">{player2 || "Player 2"}</span>
        </div>

        {/* Coin Toss Section */}
        <div className="w-full flex flex-col items-center justify-center my-3.5 p-3 rounded-2xl bg-amber-950/20 border border-amber-500/30">
          {tossWinner ? (
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs bg-emerald-950/80 border border-emerald-500/40 px-3.5 py-1.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <FaHandPointRight className="text-emerald-400" />
              <span>{tossWinner} will play first!</span>
              <button
                onClick={handleTossWithAnimation}
                className="text-[11px] underline text-emerald-400 hover:text-emerald-200 ml-1 cursor-pointer"
              >
                Retoss
              </button>
            </div>
          ) : (
            <div className="w-full flex items-center justify-between px-2">
              <span className="text-xs text-amber-300/80 font-medium">Fair coin toss for first turn:</span>
              <button
                onClick={handleTossWithAnimation}
                disabled={isTossing}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(250,204,21,0.4)] transition-all cursor-pointer active:scale-95"
              >
                <PiCoinsFill className={`text-sm ${isTossing ? "animate-spin" : ""}`} />
                <span>{isTossing ? "Flipping..." : "Flip Coin"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Player Customization Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Player 1 Settings */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-purple-500/30">
            <span className="text-xs font-bold text-purple-200 block mb-1.5 truncate">
              {player1 || "Player 1"} (X)
            </span>

            <p className="text-[10px] text-purple-400/70 mb-1 font-semibold">Theme Color:</p>
            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
              {color?.map((item) => (
                <button
                  key={item?.id}
                  onClick={() => {
                    playTapSound();
                    setSelectedColor1(item?.code);
                  }}
                  className={`w-5 h-5 rounded-md ${item?.code} transition-all ${
                    item?.code === selectedColor1
                      ? "ring-2 ring-purple-400 scale-110 shadow-[0_0_10px_rgba(168,85,247,0.7)]"
                      : "opacity-60 hover:opacity-100"
                  } cursor-pointer`}
                  disabled={item?.code === selectedColor2}
                  title={item?.title}
                />
              ))}
            </div>

            <p className="text-[10px] text-purple-400/70 mb-1 font-semibold">Animal Totem:</p>
            <div className="flex items-center gap-1.5 flex-wrap">
              {icons?.map((item) => (
                <button
                  key={item?.id}
                  onClick={() => {
                    playTapSound();
                    setSelectedIcon1(item?.title);
                  }}
                  className={`w-6 h-6 rounded-md ${selectedColor1} flex items-center justify-center text-white transition-all ${
                    item?.title === selectedIcon1
                      ? "ring-2 ring-purple-400 scale-110 shadow-[0_0_10px_rgba(168,85,247,0.7)]"
                      : "opacity-60 hover:opacity-100"
                  } cursor-pointer`}
                  disabled={item?.title === selectedIcon2}
                  title={item?.title}
                >
                  <item.icon className="text-xs" />
                </button>
              ))}
            </div>
          </div>

          {/* Player 2 Settings */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-purple-500/30">
            <span className="text-xs font-bold text-purple-200 block mb-1.5 truncate">
              {player2 || "Player 2"} (O)
            </span>

            <p className="text-[10px] text-purple-400/70 mb-1 font-semibold">Theme Color:</p>
            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
              {color?.map((item) => (
                <button
                  key={item?.id}
                  onClick={() => {
                    playTapSound();
                    setSelectedColor2(item?.code);
                  }}
                  className={`w-5 h-5 rounded-md ${item?.code} transition-all ${
                    item?.code === selectedColor2
                      ? "ring-2 ring-purple-400 scale-110 shadow-[0_0_10px_rgba(168,85,247,0.7)]"
                      : "opacity-60 hover:opacity-100"
                  } cursor-pointer`}
                  disabled={item?.code === selectedColor1}
                  title={item?.title}
                />
              ))}
            </div>

            <p className="text-[10px] text-purple-400/70 mb-1 font-semibold">Animal Totem:</p>
            <div className="flex items-center gap-1.5 flex-wrap">
              {icons?.map((item) => (
                <button
                  key={item?.id}
                  onClick={() => {
                    playTapSound();
                    setSelectedIcon2(item?.title);
                  }}
                  className={`w-6 h-6 rounded-md ${selectedColor2} flex items-center justify-center text-white transition-all ${
                    item?.title === selectedIcon2
                      ? "ring-2 ring-purple-400 scale-110 shadow-[0_0_10px_rgba(168,85,247,0.7)]"
                      : "opacity-60 hover:opacity-100"
                  } cursor-pointer`}
                  disabled={item?.title === selectedIcon1}
                  title={item?.title}
                >
                  <item.icon className="text-xs" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Turn Timer Selection */}
        <div className="mt-3 p-3 rounded-xl bg-slate-950/60 border border-purple-500/30 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-white">Blitz Clock Timer</p>
            <p className="text-[10px] text-purple-400/70">Seconds countdown per player</p>
          </div>
          <div className="flex items-center gap-1.5">
            {[20, 15, 10].map((sec) => (
              <button
                key={sec}
                onClick={() => {
                  playTapSound();
                  setMatchDuration(sec);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  matchDuration === sec
                    ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.6)]"
                    : "bg-slate-900 border border-purple-500/30 text-purple-300 hover:bg-slate-800"
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>

        {/* Start Game Action */}
        <div className="w-full flex items-center justify-end gap-2.5 mt-5">
          <button
            onClick={() => {
              playTapSound();
              setIsModalOpen(false);
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-purple-300 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleStartMatch}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all cursor-pointer active:scale-95"
          >
            <PiGameControllerFill className="text-base" />
            <span>Launch Match</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameSettingsModal;
