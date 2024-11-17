'use client'

import Sudoku from "./sudoku";

import {generateSudoku} from "./Sudoku-lib"

let initialSudokuGrid = [
  [5, 3, "", "", 7, "", "", "", ""],
  [6, "", "", 1, 9, 5, "", "", ""],
  ["", 9, 8, "", "", "", "", 6, ""],
  [8, "", "", "", 6, "", "", "", 3],
  [4, "", "", 8, "", 3, "", "", 1],
  [7, "", "", "", 2, "", "", "", 6],
  ["", 6, "", "", "", "", 2, 8, ""],
  ["", "", "", 4, 1, 9, "", "", 5],
  ["", "", "", "", 8, "", "", 7, 9],
];

initialSudokuGrid = generateSudoku(0.1)


export default function Home() {
  return (
    <div>
      <Sudoku initialGrid={initialSudokuGrid} />
    </div>
  );
}
