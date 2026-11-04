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
        className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-purple-500/30 text-purple-200 hover:text-white text-xs font-semibold transition-all cursor-pointer text-left active:scale-98 shadow-2xs"
        onClick={() => jumpTo(move)}
      >
        <span className="w-5 h-5 rounded-md bg-purple-950 text-purple-300 border border-purple-500/40 flex items-center justify-center text-[10px] font-bold">
          {move}
        </span>
        <span className="flex-1">{description}</span>
        <FaRegHandPointRight className="text-purple-400 text-xs" />
      </button>
    );
  });

  return <div className="space-y-1.5 mt-2">{moves}</div>;
};

export default History;
