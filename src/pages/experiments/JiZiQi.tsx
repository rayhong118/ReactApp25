import React from "react";

interface JiZiQiProps {
  totalSize: number;
  targetLength: number;
}
export const JiZiQi = (props: JiZiQiProps) => {
  const { totalSize, targetLength } = props;
  const initGridData: number[][] = new Array(totalSize)
    .fill(0)
    .map(() => new Array(totalSize).fill(0));
  const [gridData, setGridData] = React.useState<number[][]>(initGridData);

  const victoryCheck = (rowIndex: number, colIndex: number) => {
    const currentColor = gridData[rowIndex][colIndex];

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
};
