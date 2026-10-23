import React from "react";
import { FaRegHandPointRight } from "react-icons/fa";

const History = ({ history, jumpTo }) => {
  const moves = history?.map((squares, move) => {
    let description;

    if (move > 0) {
      description = `Go to Move #${move}`;
    } else {
      description = `Back to Start`;
    }

    return (
      <button
        key={move}
        className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-all cursor-pointer text-left active:scale-98 shadow-2xs"
        onClick={() => jumpTo(move)}
      >
        <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
          {move}
        </span>
        <span className="flex-1">{description}</span>
        <FaRegHandPointRight className="text-indigo-400 text-xs" />
      </button>
    );
  });

  return <div className="space-y-1.5 mt-2">{moves}</div>;
};

export default History;
