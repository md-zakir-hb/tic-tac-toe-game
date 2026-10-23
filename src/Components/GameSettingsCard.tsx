import React, { useState } from "react";
import { FaHandPointRight } from "react-icons/fa";
import { HiMiniXMark } from "react-icons/hi2";
import { PiCoinsFill, PiGameControllerFill } from "react-icons/pi";
import { TbVs } from "react-icons/tb";
import { color } from "../utils/color";
import { icons } from "../utils/icons";

const GameSettingsCard = ({
  setPlayer1,
  setPlayer2,
  player1,
  player2,
  tossWinner,
  handleToss,
  handleStartGame,
  handleCloseModal,
  selectedColor1,
  selectedColor2,
  setSelectedColor1,
  setSelectedColor2,
  selectedIcon1,
  selectedIcon2,
  setSelectedIcon1,
  setSelectedIcon2,
  matchDuration,
  setMatchDuration,
  setIsRunning,
}) => {
  const [warning, setWarning] = useState(false);
  const [isTossing, setIsTossing] = useState(false);

  const handleTossWithAnimation = () => {
    setIsTossing(true);
    setWarning(false);
    setTimeout(() => {
      handleToss();
      setIsTossing(false);
    }, 500);
  };

  const handlePlayStart = () => {
    setWarning(false);
    if (!tossWinner) {
      setWarning(true);
      return;
    }

    handleStartGame();
    setIsRunning(true);
    handleCloseModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white border border-slate-200 shadow-xl rounded-2xl p-6 sm:p-7 relative text-slate-800">
        {/* Close Button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 rounded-lg p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Close"
        >
          <HiMiniXMark className="text-xl" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-xl">
            <PiGameControllerFill />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Game Setup</h3>
            <p className="text-xs text-slate-500">Customize players, icons, and timer</p>
          </div>
        </div>

        {/* Player Names Input Section */}
        <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Player 1 Name (X):
            </label>
            <input
              type="text"
              name="firstPlayerName"
              placeholder="Player 1"
              value={player1}
              className="bg-white border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-1.5 text-sm text-slate-900 outline-none transition-all sm:w-56"
              onChange={(e) => setPlayer1(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Player 2 Name (O):
            </label>
            <input
              type="text"
              name="secondPlayerName"
              placeholder="Player 2"
              value={player2}
              className="bg-white border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-1.5 text-sm text-slate-900 outline-none transition-all sm:w-56"
              onChange={(e) => setPlayer2(e.target.value)}
            />
          </div>
        </div>

        {/* VS Indicator */}
        <div className="mt-3.5 w-full flex items-center justify-center gap-3 py-1.5 px-4 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700">
          <span className="text-indigo-600 font-bold">{player1 || "Player 1"}</span>
          <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold">
            <TbVs />
          </div>
          <span className="text-rose-600 font-bold">{player2 || "Player 2"}</span>
        </div>

        {/* Toss Section */}
        <div className="w-full flex flex-col items-center justify-center my-4 p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
          {tossWinner ? (
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm bg-emerald-100 border border-emerald-200 px-4 py-1.5 rounded-lg">
              <FaHandPointRight className="text-emerald-600 text-sm" />
              <span>{tossWinner} will play first!</span>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center">
              <button
                onClick={handleTossWithAnimation}
                disabled={isTossing}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-sm shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <PiCoinsFill className={`text-base ${isTossing ? "animate-spin" : ""}`} />
                <span>{isTossing ? "Flipping..." : "Flip Coin for First Turn"}</span>
              </button>
              {warning && (
                <p className="text-rose-600 text-xs font-medium mt-1.5">
                  ⚠️ Please flip the coin to determine who plays first.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Player Customization Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Player 1 Settings */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-800 block mb-2">
              {player1 || "Player 1"}
            </span>

            <p className="text-[11px] text-slate-500 mb-1 font-medium">Color:</p>
            <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
              {color?.map((item) => (
                <button
                  key={item?.id}
                  onClick={() => setSelectedColor1(item?.code)}
                  className={`w-6 h-6 rounded-md ${item?.code} transition-all ${
                    item?.code === selectedColor1
                      ? "ring-2 ring-indigo-600 scale-110 shadow-xs"
                      : "opacity-60 hover:opacity-100"
                  } cursor-pointer`}
                  disabled={item?.code === selectedColor2}
                  title={item?.title}
                />
              ))}
            </div>

            <p className="text-[11px] text-slate-500 mb-1 font-medium">Avatar:</p>
            <div className="flex items-center gap-1.5 flex-wrap">
              {icons?.map((item) => (
                <button
                  key={item?.id}
                  onClick={() => setSelectedIcon1(item?.title)}
                  className={`w-7 h-7 rounded-md ${selectedColor1} flex items-center justify-center text-white transition-all ${
                    item?.title === selectedIcon1
                      ? "ring-2 ring-indigo-600 scale-110 shadow-xs"
                      : "opacity-60 hover:opacity-100"
                  } cursor-pointer`}
                  disabled={item?.title === selectedIcon2}
                  title={item?.title}
                >
                  <item.icon className="text-sm" />
                </button>
              ))}
            </div>
          </div>

          {/* Player 2 Settings */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-800 block mb-2">
              {player2 || "Player 2"}
            </span>

            <p className="text-[11px] text-slate-500 mb-1 font-medium">Color:</p>
            <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
              {color?.map((item) => (
                <button
                  key={item?.id}
                  onClick={() => setSelectedColor2(item?.code)}
                  className={`w-6 h-6 rounded-md ${item?.code} transition-all ${
                    item?.code === selectedColor2
                      ? "ring-2 ring-indigo-600 scale-110 shadow-xs"
                      : "opacity-60 hover:opacity-100"
                  } cursor-pointer`}
                  disabled={item?.code === selectedColor1}
                  title={item?.title}
                />
              ))}
            </div>

            <p className="text-[11px] text-slate-500 mb-1 font-medium">Avatar:</p>
            <div className="flex items-center gap-1.5 flex-wrap">
              {icons?.map((item) => (
                <button
                  key={item?.id}
                  onClick={() => setSelectedIcon2(item?.title)}
                  className={`w-7 h-7 rounded-md ${selectedColor2} flex items-center justify-center text-white transition-all ${
                    item?.title === selectedIcon2
                      ? "ring-2 ring-indigo-600 scale-110 shadow-xs"
                      : "opacity-60 hover:opacity-100"
                  } cursor-pointer`}
                  disabled={item?.title === selectedIcon1}
                  title={item?.title}
                >
                  <item.icon className="text-sm" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Turn Timer Selection */}
        <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-800">Turn Timer</p>
            <p className="text-[11px] text-slate-500">Total seconds per player</p>
          </div>
          <div className="flex items-center gap-1.5">
            {[20, 15, 10].map((sec) => (
              <button
                key={sec}
                onClick={() => setMatchDuration(sec)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  matchDuration === sec
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
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
            onClick={handleCloseModal}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handlePlayStart}
            id="start-playing-modal-btn"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <PiGameControllerFill className="text-base" />
            <span>Start Game</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameSettingsCard;
