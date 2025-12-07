import React from "react";

// interface JiZiQiProps {
//   totalSize: number;
//   targetLength: number;
// }

export const JiZiQi = () => {
  const totalSize = 15;
  const targetLength = 5;
  const initGridData: number[][] = new Array(totalSize).fill(
    new Array(totalSize).fill(0)
  );
  const [gridData, setGridData] = React.useState<number[][]>(initGridData);
  const [currentPlayer, setCurrentPlayer] = React.useState<number>(1); // 1 or 2

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    const currentCell = gridData[rowIndex][colIndex];
    console.log(currentPlayer, rowIndex, colIndex);
    // If cell is already occupied, do nothing
    if (currentCell !== 0) return;
    else {
      // Update grid data
      const newGridData = gridData.map((row, rIdx) =>
        row.map((cell, cIdx) =>
          rIdx === rowIndex && cIdx === colIndex ? currentPlayer : cell
        )
      );
      setGridData(newGridData);
    }
    const victory = victoryCheck(rowIndex, colIndex);
    if (victory) {
      console.log(currentPlayer, "Victory!");
      return;
    }
    // Switch player
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  };

  const victoryCheck = (rowIndex: number, colIndex: number) => {
    const currentColor = currentPlayer;

    // Directions: [rowDelta, colDelta]
    const directions = [
      [0, 1], // horizontal →
      [1, 0], // vertical ↓
      [1, 1], // diagonal ↘
      [1, -1], // diagonal ↙
    ];

    const inBounds = (r: number, c: number) =>
      r >= 0 && r < totalSize && c >= 0 && c < totalSize;

    const countInDirection = (dr: number, dc: number) => {
      let count = 1; // include starting cell

      // check forward
      let r = rowIndex + dr;
      let c = colIndex + dc;
      while (inBounds(r, c) && gridData[r][c] === currentColor) {
        count++;
        r += dr;
        c += dc;
      }

      // check backward
      r = rowIndex - dr;
      c = colIndex - dc;
      while (inBounds(r, c) && gridData[r][c] === currentColor) {
        count++;
        r -= dr;
        c -= dc;
      }

      return count;
    };

    // Check all directions
    return directions.some(
      ([dr, dc]) => countInDirection(dr, dc) >= targetLength
    );
  };

  return (
    <div className="p-20">
      <h1>棋子</h1>
      <div>Current player: {currentPlayer === 1 ? "X" : "O"}</div>
      <div>
        {gridData.map((row, rowIndex) => {
          return (
            <div key={"rowIndex" + rowIndex}>
              {row.map((cell, colIndex) => {
                return (
                  <span
                    className="inline-block w-8 h-8 border border-gray-400 text-center leading-8 cursor-pointer select-none"
                    key={"cellIndex" + colIndex}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {cell === 0 ? "" : cell === 1 ? "X" : "O"}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
