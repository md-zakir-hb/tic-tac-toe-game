import { useState } from "react";
import Game from "./Components/Game";
import GameSettingsCard from "./Components/GameSettingsCard";
import Home from "./Components/Home";

function App() {
  const [isStartGame, setIsStartGame] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [player1, setPlayer1] = useState("Player 1");
  const [player2, setPlayer2] = useState("Player 2");
  const [tossWinner, setTossWinner] = useState("");
  const [selectedColor1, setSelectedColor1] = useState("bg-[#fb6f92]");
  const [selectedColor2, setSelectedColor2] = useState("bg-[#fb8500]");
  const [selectedIcon1, setSelectedIcon1] = useState("bird");
  const [selectedIcon2, setSelectedIcon2] = useState("lion");
  const [matchDuration, setMatchDuration] = useState(20);

  const [isRunning, setIsRunning] = useState(false);

  const handleStartGame = () => setIsStartGame(true);
  const handleCloseGame = () => setIsStartGame(false);

  const handleOpenModal = () => setIsOpenModal(true);
  const handleCloseModal = () => setIsOpenModal(false);

  const handleToss = () => {
    const randomValue = Math.floor(Math.random() * 9);

    if (randomValue % 2 === 0) {
      setTossWinner(player1);
    } else {
      setTossWinner(player2);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-800 flex flex-col items-center justify-start relative selection:bg-indigo-500 selection:text-white">
      {isStartGame ? (
        <Game
          player1={player1}
          player2={player2}
          selectedColor1={selectedColor1}
          selectedColor2={selectedColor2}
          selectedIcon1={selectedIcon1}
          selectedIcon2={selectedIcon2}
          handleCloseGame={handleCloseGame}
          tossWinner={tossWinner}
          matchDuration={matchDuration}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
        />
      ) : (
        <Home handleOpenModal={handleOpenModal} />
      )}

      {isOpenModal && (
        <GameSettingsCard
          setPlayer1={setPlayer1}
          setPlayer2={setPlayer2}
          player1={player1}
          player2={player2}
          tossWinner={tossWinner}
          handleToss={handleToss}
          handleStartGame={handleStartGame}
          handleCloseModal={handleCloseModal}
          selectedColor1={selectedColor1}
          selectedColor2={selectedColor2}
          setSelectedColor1={setSelectedColor1}
          setSelectedColor2={setSelectedColor2}
          selectedIcon1={selectedIcon1}
          selectedIcon2={selectedIcon2}
          setSelectedIcon1={setSelectedIcon1}
          setSelectedIcon2={setSelectedIcon2}
          matchDuration={matchDuration}
          setMatchDuration={setMatchDuration}
          setIsRunning={setIsRunning}
        />
      )}
    </div>
  );
}

export default App;
