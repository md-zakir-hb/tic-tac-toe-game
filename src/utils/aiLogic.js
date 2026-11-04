import { checkWinner } from "./gameRules";

/**
 * Classical Smart AI Move
 * 1. Win immediately if possible ('O')
 * 2. Block player if player can win on next move ('X')
 * 3. Take center tile (index 4) if free
 * 4. Take opposite corner or any corner
 * 5. Take random available tile
 */
export const getClassicalAiMove = (board) => {
  const available = [];
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) available.push(i);
  }
  if (available.length === 0) return null;

  // 1. Can AI ('O') win immediately?
  for (const move of available) {
    const sim = [...board];
    sim[move] = "O";
    if (checkWinner(sim).winner === "O") return move;
  }

  // 2. Can Player ('X') win on next turn? Block them!
  for (const move of available) {
    const sim = [...board];
    sim[move] = "X";
    if (checkWinner(sim).winner === "X") return move;
  }

  // 3. Take center if free
  if (board[4] === null) return 4;

  // 4. Strategic corners
  const corners = [0, 2, 6, 8].filter((c) => board[c] === null);
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  // 5. Fallback random
  return available[Math.floor(Math.random() * available.length)];
};

/**
 * Vanishing Mode Smart AI Move
 * Considers that placing the 4th move removes AI's oldest piece!
 */
export const getVanishingAiMove = (board, p1Moves, p2Moves) => {
  // Candidate cells: either empty, or the cell containing AI's oldest piece (since it will vanish)
  const p2Oldest = p2Moves.length === 3 ? p2Moves[0] : null;
  const candidates = [];

  for (let i = 0; i < 9; i++) {
    if (board[i] === null || i === p2Oldest) {
      candidates.push(i);
    }
  }

  if (candidates.length === 0) return null;

  // 1. Check if AI can win with this placement
  for (const move of candidates) {
    const sim = [...board];
    if (p2Moves.length === 3) {
      sim[p2Moves[0]] = null; // simulate oldest vanishing
    }
    sim[move] = "O";
    if (checkWinner(sim).winner === "O") return move;
  }

  // 2. Check if player will win on their upcoming turn, and block them
  const p1Oldest = p1Moves.length === 3 ? p1Moves[0] : null;
  const p1Candidates = [];
  for (let i = 0; i < 9; i++) {
    if (board[i] === null || i === p1Oldest) {
      p1Candidates.push(i);
    }
  }

  for (const pMove of p1Candidates) {
    const simP1 = [...board];
    if (p1Moves.length === 3) {
      simP1[p1Moves[0]] = null;
    }
    simP1[pMove] = "X";
    if (checkWinner(simP1).winner === "X") {
      // If AI can take this blocking spot, do it!
      if (candidates.includes(pMove)) {
        return pMove;
      }
    }
  }

  // 3. Prefer center
  if (candidates.includes(4)) return 4;

  // 4. Prefer corners
  const corners = [0, 2, 6, 8].filter((c) => candidates.includes(c));
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  // 5. Any candidate
  return candidates[Math.floor(Math.random() * candidates.length)];
};
