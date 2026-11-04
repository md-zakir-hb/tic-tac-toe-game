import ClassicalArena from "./Components/ClassicalArena";
import CustomBlitzArena from "./Components/CustomBlitzArena";
import DiceArena from "./Components/DiceArena";
import GameSettingsModal from "./Components/GameSettingsModal";
import Lobby from "./Components/Lobby";
import Navbar from "./Components/Navbar";
import VanishingArena from "./Components/VanishingArena";
import { useGameStore } from "./store/useGameStore";

function App() {
  const { activeMode } = useGameStore();

  const renderActiveScreen = () => {
    switch (activeMode) {
      case "classical":
        return <ClassicalArena />;
      case "dice":
        return <DiceArena />;
      case "vanishing":
        return <VanishingArena />;
      case "custom":
        return <CustomBlitzArena />;
      case "lobby":
      default:
        return <Lobby />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#080612] text-slate-100 flex flex-col items-center justify-start relative selection:bg-purple-600 selection:text-white overflow-x-hidden">
      {/* Ambient Cyber Glow Layers */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-purple-600/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-40 right-[-10%] w-[500px] h-[500px] bg-pink-600/10 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-60 left-[-10%] w-[500px] h-[500px] bg-cyan-600/10 blur-[130px] pointer-events-none -z-10" />

      {/* Top Navigation (Transparent, No bottom border) */}
      <Navbar />

      {/* Main Dynamic Viewport */}
      <main className="w-full flex-1 flex flex-col items-center justify-start">
        {renderActiveScreen()}
      </main>

      {/* Global Modals */}
      <GameSettingsModal />
    </div>
  );
}

export default App;
