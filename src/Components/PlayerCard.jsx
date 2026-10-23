import React, { useEffect, useState } from "react";
import { FaCrown } from "react-icons/fa";
import { PiTimerFill } from "react-icons/pi";
import { icons } from "../utils/icons";

const PlayerCard = ({
  player1,
  player2,
  selectedColor1,
  selectedColor2,
  selectedIcon1,
  selectedIcon2,
  xIsNext,
  status,
  setStatus,
  matchDuration,
  isRunning,
  setIsRunning,
  time1,
  setTime1,
  time2,
  setTime2,
}) => {
  const [activePlayer, setActivePlayer] = useState(1);

  const icon1 = icons.find((icon) => icon.title === selectedIcon1);
  const icon2 = icons.find((icon) => icon.title === selectedIcon2);

  useEffect(() => {
    if (status) {
      setTime1(0);
      setTime2(0);
      setIsRunning(false);
      return;
    }

    if (time1 === 0 && time2 > 0) {
      setStatus("O");
      setIsRunning(false);
      return;
    }

    if (time2 === 0 && time1 > 0) {
      setStatus("X");
      setIsRunning(false);
      return;
    }

    let timer;
    if (isRunning) {
      if (activePlayer === 1 && time1 > 0) {
        timer = setInterval(() => {
          setTime1((prevTime) => Math.max(prevTime - 1, 0));
        }, 1000);
      } else if (activePlayer === 2 && time2 > 0) {
        timer = setInterval(() => {
          setTime2((prevTime) => Math.max(prevTime - 1, 0));
        }, 1000);
      }
    }

    return () => clearInterval(timer);
  }, [activePlayer, isRunning, time1, time2, status, setIsRunning, setStatus, setTime1, setTime2]);

  useEffect(() => {
    if (xIsNext) {
      setActivePlayer(1);
    } else {
      setActivePlayer(2);
    }
  }, [xIsNext]);

  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
      {/* Player 1 Card */}
      <div
        className={`flex items-center gap-3.5 p-3 rounded-xl transition-all ${
          activePlayer === 1 && !status
            ? "bg-indigo-50/80 border-2 border-indigo-500 shadow-xs"
            : "bg-slate-50 border border-slate-200"
        }`}
      >
        <div
          className={`w-11 h-11 rounded-xl ${selectedColor1} flex items-center justify-center text-white text-xl shadow-xs`}
        >
          {icon1?.icon ? <icon1.icon /> : <span>X</span>}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-slate-900 font-bold text-sm sm:text-base">{player1 || "Player 1"}</h2>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold">X</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-slate-500 text-xs">
            <PiTimerFill className="text-amber-500 text-sm" />
            <span className={`font-mono font-bold ${time1 <= 5 ? "text-rose-600 font-extrabold" : "text-slate-700"}`}>
              {time1}s left
            </span>
          </div>
        </div>
      </div>

      {/* Middle Status / Winner Badge */}
      <div className="flex flex-col items-center">
        {status ? (
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-amber-50 border border-amber-200">
            {status === "draw" ? (
              <span className="text-amber-800 font-bold text-sm">🤝 Match Draw</span>
            ) : (
              <div className="flex items-center gap-2">
                <FaCrown className="text-amber-500 text-base" />
                <span className="text-slate-900 font-bold text-sm">
                  Winner: {status === "X" ? player1 : player2}
                </span>
                <div
                  className={`w-6 h-6 rounded-md ${
                    status === "X" ? selectedColor1 : selectedColor2
                  } flex items-center justify-center text-white text-xs`}
                >
                  {status === "X" ? (
                    icon1?.icon && <icon1.icon />
                  ) : (
                    icon2?.icon && <icon2.icon />
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Turn:</span>
            <div
              className={`w-5 h-5 rounded-md ${
                xIsNext ? selectedColor1 : selectedColor2
              } flex items-center justify-center text-white text-xs shadow-xs`}
            >
              {xIsNext ? (
                icon1?.icon ? <icon1.icon /> : "X"
              ) : (
                icon2?.icon ? <icon2.icon /> : "O"
              )}
            </div>
            <span className="text-xs font-bold text-slate-800">
              {xIsNext ? player1 : player2}
            </span>
          </div>
        )}
      </div>

      {/* Player 2 Card */}
      <div
        className={`flex items-center gap-3.5 p-3 rounded-xl transition-all ${
          activePlayer === 2 && !status
            ? "bg-rose-50/80 border-2 border-rose-500 shadow-xs"
            : "bg-slate-50 border border-slate-200"
        }`}
      >
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold">O</span>
            <h2 className="text-slate-900 font-bold text-sm sm:text-base">{player2 || "Player 2"}</h2>
          </div>
          <div className="flex items-center justify-end gap-1 mt-1 text-slate-500 text-xs">
            <PiTimerFill className="text-amber-500 text-sm" />
            <span className={`font-mono font-bold ${time2 <= 5 ? "text-rose-600 font-extrabold" : "text-slate-700"}`}>
              {time2}s left
            </span>
          </div>
        </div>
        <div
          className={`w-11 h-11 rounded-xl ${selectedColor2} flex items-center justify-center text-white text-xl shadow-xs`}
        >
          {icon2?.icon ? <icon2.icon /> : <span>O</span>}
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
