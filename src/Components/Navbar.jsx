import { FaDice, FaHome, FaRobot, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { PiHourglassFill, PiTimerFill } from "react-icons/pi";
import { TbTicTac } from "react-icons/tb";
import { useGameStore } from "../store/useGameStore";
import { playTapSound } from "../utils/soundEffects";

const Navbar = () => {
  const { activeMode, setActiveMode, soundEnabled, toggleSound, setIsModalOpen } = useGameStore();

  const handleModeChange = (mode) => {
    playTapSound();
    setActiveMode(mode);
  };

  const getModeBadge = () => {
    switch (activeMode) {
      case "classical":
        return { label: "Classical Arena", icon: FaRobot, color: "text-purple-300 bg-purple-950/60 border-purple-500/40" };
      case "dice":
        return { label: "Dice Luck Mode", icon: FaDice, color: "text-amber-300 bg-amber-950/60 border-amber-500/40" };
      case "vanishing":
        return { label: "Vanishing Blitz", icon: PiHourglassFill, color: "text-rose-300 bg-rose-950/60 border-rose-500/40" };
      case "custom":
        return { label: "Custom Blitz Match", icon: PiTimerFill, color: "text-emerald-300 bg-emerald-950/60 border-emerald-500/40" };
      default:
        return null;
    }
  };

  const currentBadge = getModeBadge();

  return (
    <nav className="w-full max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between bg-transparent z-40">
      {/* Brand & Active Mode */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => handleModeChange("lobby")}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 group-hover:from-purple-500 group-hover:to-indigo-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-purple-400/40 transition-all">
            <TbTicTac className="text-2xl" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base sm:text-lg text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                TIC TAC TOE
              </span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 hidden sm:inline-block tracking-wider">
                BLITZ 3D
              </span>
            </div>
            <p className="text-[11px] text-purple-300/60 font-medium">Tactical Cyber Arena</p>
          </div>
        </button>

        {currentBadge && (
          <div className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${currentBadge.color} ml-3`}>
            <currentBadge.icon />
            <span>{currentBadge.label}</span>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {activeMode !== "lobby" ? (
          <button
            onClick={() => handleModeChange("lobby")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.25)] active:scale-95"
          >
            <FaHome className="text-sm" />
            <span>Lobby</span>
          </button>
        ) : (
          <button
            onClick={() => {
              playTapSound();
              setIsModalOpen(true);
            }}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
          >
            <PiTimerFill className="text-sm text-purple-400" />
            <span>Timed Match</span>
          </button>
        )}

        {/* Audio Toggle */}
        <button
          onClick={() => {
            playTapSound();
            toggleSound();
          }}
          className={`p-2 sm:px-3 sm:py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md ${
            soundEnabled
              ? "bg-slate-900/60 hover:bg-slate-800/70 border-purple-500/30 text-purple-200 shadow-2xs"
              : "bg-rose-950/60 border-rose-500/40 text-rose-300"
          }`}
          title={soundEnabled ? "Mute Game Audio" : "Unmute Game Audio"}
        >
          {soundEnabled ? <FaVolumeUp className="text-sm text-purple-400" /> : <FaVolumeMute className="text-sm" />}
          <span className="hidden sm:inline">{soundEnabled ? "SFX ON" : "Muted"}</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
