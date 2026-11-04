// Shared winning lines for standard 3x3 grid
export const WINNING_LINES = [
  [0, 1, 2], // Row 1
  [3, 4, 5], // Row 2
  [6, 7, 8], // Row 3
  [0, 3, 6], // Col 1
  [1, 4, 7], // Col 2
  [2, 5, 8], // Col 3
  [0, 4, 8], // Diagonal 1
  [2, 4, 6], // Diagonal 2
];

/**
 * Standard Tic Tac Toe winner calculation
 * Returns { winner: 'X' | 'O' | 'draw' | null, line: number[] | null }
 */
export const checkWinner = (squares) => {
  for (let i = 0; i < WINNING_LINES.length; i++) {
    const [a, b, c] = WINNING_LINES[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: WINNING_LINES[i] };
    }
  }

  if (squares.every((sq) => sq !== null)) {
    return { winner: "draw", line: null };
  }

  return { winner: null, line: null };
};

/**
 * Vanishing Mode winner calculation (No draws possible, returns winner and line)
 */
export const checkVanishingWinner = (squares) => {
  for (let i = 0; i < WINNING_LINES.length; i++) {
    const [a, b, c] = WINNING_LINES[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: WINNING_LINES[i] };
    }
  }
  return { winner: null, line: null };
};

