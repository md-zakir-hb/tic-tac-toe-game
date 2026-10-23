import React from "react";
import { icons } from "../utils/icons";

const Square = ({
  value,
  onSquareClick,
  selectedColor1,
  selectedColor2,
  selectedIcon1,
  selectedIcon2,
}) => {
  const icon1 = icons?.find((icon) => icon.title === selectedIcon1);
  const icon2 = icons?.find((icon) => icon.title === selectedIcon2);

  return (
    <button
      onClick={onSquareClick}
      className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 m-1.5 sm:m-2 rounded-2xl cursor-pointer flex items-center justify-center text-3xl sm:text-4xl text-white font-bold transition-all select-none ${
        !value
          ? "bg-white hover:bg-slate-50 border border-slate-300 hover:border-indigo-400 shadow-xs hover:shadow-sm active:scale-95"
          : value === "X"
          ? `${selectedColor1} border-2 border-white/40 shadow-sm`
          : `${selectedColor2} border-2 border-white/40 shadow-sm`
      }`}
    >
      {value ? (
        value === "X" ? (
          icon1?.icon ? <icon1.icon /> : <span>X</span>
        ) : (
          icon2?.icon ? <icon2.icon /> : <span>O</span>
        )
      ) : (
        <span className="text-slate-300 text-lg">·</span>
      )}
    </button>
  );
};

export default Square;
