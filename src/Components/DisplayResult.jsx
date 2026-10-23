import React from "react";
import { FaCrown } from "react-icons/fa";
import { icons } from "../utils/icons";

const DisplayResult = ({
  status,
  selectedColor1,
  selectedColor2,
  selectedIcon1,
  selectedIcon2,
}) => {
  const icon1 = icons.find((icon) => icon.title === selectedIcon1);
  const icon2 = icons.find((icon) => icon.title === selectedIcon2);

  if (!status) return null;

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-slate-200 shadow-sm min-w-[170px]">
      {status === "X" || status === "O" ? (
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5 text-amber-600 font-bold text-xs uppercase tracking-wider mb-2">
            <FaCrown className="text-sm" />
            <span>Winner!</span>
          </div>
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-xs ${
              status === "X" ? selectedColor1 : selectedColor2
            }`}
          >
            {status === "X" ? (
              icon1?.icon ? <icon1.icon className="text-4xl" /> : <span className="text-3xl font-black">X</span>
            ) : (
              icon2?.icon ? <icon2.icon className="text-4xl" /> : <span className="text-3xl font-black">O</span>
            )}
          </div>
          <p className="mt-3 text-sm font-bold text-slate-800">Player {status} Wins!</p>
        </div>
      ) : (
        status === "draw" && (
          <div className="flex flex-col items-center text-center">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">Result</span>
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-amber-700 bg-amber-50 border-2 border-amber-300 uppercase font-black text-lg">
              DRAW
            </div>
            <p className="mt-3 text-xs text-slate-500">Good Match!</p>
          </div>
        )
      )}
    </div>
  );
};

export default DisplayResult;
