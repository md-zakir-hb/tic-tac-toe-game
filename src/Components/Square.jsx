import { icons } from "../utils/icons";

const Square = ({
  value,
  onSquareClick,
  selectedColor1,
  selectedColor2,
  selectedIcon1,
  selectedIcon2,
  isWinningCell,
}) => {
  const icon1 = icons?.find((icon) => icon.title === selectedIcon1);
  const icon2 = icons?.find((icon) => icon.title === selectedIcon2);

  return (
    <button
      onClick={onSquareClick}
      className={`w-[66px] h-[66px] min-[360px]:w-[76px] min-[360px]:h-[76px] sm:w-24 sm:h-24 md:w-28 md:h-28 m-1 min-[360px]:m-1.5 sm:m-2 rounded-xl sm:rounded-2xl cursor-pointer flex items-center justify-center text-2xl min-[360px]:text-3xl sm:text-4xl text-white font-bold transition-all select-none ${
        isWinningCell
          ? "ring-4 ring-emerald-400 scale-105 z-10 shadow-[0_0_30px_rgba(16,185,129,0.7)]"
          : ""
      } ${
        !value
          ? "bg-slate-900/60 hover:bg-slate-800/90 border border-purple-500/30 hover:border-purple-400 shadow-sm active:scale-95"
          : value === "X"
          ? `${selectedColor1} border-2 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.25)]`
          : `${selectedColor2} border-2 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.25)]`
      }`}
    >
      {value ? (
        value === "X" ? (
          icon1?.icon ? <icon1.icon /> : <span>X</span>
        ) : (
          icon2?.icon ? <icon2.icon /> : <span>O</span>
        )
      ) : (
        <span className="text-purple-500/30 text-lg">·</span>
      )}
    </button>
  );
};

export default Square;
