import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useGameStore = create(
  persist(
    (set) => ({
      // Current View: 'lobby' | 'classical' | 'dice' | 'vanishing' | 'custom'
      activeMode: "lobby",
      setActiveMode: (mode) => set({ activeMode: mode }),

      // Audio Toggle
      soundEnabled: true,
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      // Custom Blitz Setup Settings
      player1: "Player 1",
      player2: "Player 2",
      selectedColor1: "bg-[#fb6f92]",
      selectedColor2: "bg-[#fb8500]",
      selectedIcon1: "bird",
      selectedIcon2: "lion",
      matchDuration: 20,
      tossWinner: "",
      isModalOpen: false,

      setPlayer1: (name) => set({ player1: name }),
      setPlayer2: (name) => set({ player2: name }),
      setSelectedColor1: (color) => set({ selectedColor1: color }),
      setSelectedColor2: (color) => set({ selectedColor2: color }),
      setSelectedIcon1: (icon) => set({ selectedIcon1: icon }),
      setSelectedIcon2: (icon) => set({ selectedIcon2: icon }),
      setMatchDuration: (duration) => set({ matchDuration: duration }),
      setTossWinner: (winner) => set({ tossWinner: winner }),
      setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),

      // Scoreboard Persistence across all modes
      scores: {
        classical: { player: 0, ai: 0, draws: 0 },
        dice: { player: 0, ai: 0, draws: 0 },
        vanishing: { player: 0, ai: 0 },
        custom: { player1: 0, player2: 0, draws: 0 },
      },

      recordWin: (mode, winner) => {
        set((state) => {
          const currentModeScores = { ...state.scores[mode] };

          if (mode === "custom") {
            if (winner === "X") currentModeScores.player1 = (currentModeScores.player1 || 0) + 1;
            else if (winner === "O") currentModeScores.player2 = (currentModeScores.player2 || 0) + 1;
            else if (winner === "draw") currentModeScores.draws = (currentModeScores.draws || 0) + 1;
          } else if (mode === "vanishing") {
            if (winner === "X") currentModeScores.player = (currentModeScores.player || 0) + 1;
            else if (winner === "O") currentModeScores.ai = (currentModeScores.ai || 0) + 1;
          } else {
            if (winner === "X") currentModeScores.player = (currentModeScores.player || 0) + 1;
            else if (winner === "O") currentModeScores.ai = (currentModeScores.ai || 0) + 1;
            else if (winner === "draw") currentModeScores.draws = (currentModeScores.draws || 0) + 1;
          }

          return {
            scores: {
              ...state.scores,
              [mode]: currentModeScores,
            },
          };
        });
      },

      resetScores: (mode) => {
        set((state) => {
          if (mode) {
            return {
              scores: {
                ...state.scores,
                [mode]: mode === "vanishing" ? { player: 0, ai: 0 } : { player: 0, ai: 0, draws: 0 },
              },
            };
          }
          return {
            scores: {
              classical: { player: 0, ai: 0, draws: 0 },
              dice: { player: 0, ai: 0, draws: 0 },
              vanishing: { player: 0, ai: 0 },
              custom: { player1: 0, player2: 0, draws: 0 },
            },
          };
        });
      },
    }),
    {
      name: "tic-tac-toe-storage",
      partialize: (state) => ({
        scores: state.scores,
        soundEnabled: state.soundEnabled,
        player1: state.player1,
        player2: state.player2,
        selectedColor1: state.selectedColor1,
        selectedColor2: state.selectedColor2,
        selectedIcon1: state.selectedIcon1,
        selectedIcon2: state.selectedIcon2,
        matchDuration: state.matchDuration,
      }),
    }
  )
);
