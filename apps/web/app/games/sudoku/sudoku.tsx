'use client'

import { useEffect, useState } from "react";

interface SudokuProps {
  initialGrid: (number | string)[][]; // 2D array with numbers or empty strings
}

const Sudoku: React.FC<SudokuProps> = ({ initialGrid }) => {
  const [grid, setGrid] = useState<(number | string)[][]>([]);

  // Initialize grid on component mount
   useEffect(() => {
    // Replace all `0`s in the grid with `""` to ensure empty cells
    const sanitizedGrid = initialGrid.map((row) =>
      row.map((cell) => (cell === 0 ? "" : cell))
    );
    setGrid(sanitizedGrid);
  }, [initialGrid]);


  const handleChange = (row: number, col: number, value: string) => {
    if (value === "" || (/^[1-9]$/.test(value) && value.length === 1)) {
      const newGrid = grid.map((r, rowIndex) =>
        r.map((cell, colIndex) => (rowIndex === row && colIndex === col ? value : cell))
      );
      setGrid(newGrid);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Sudoku Game (WIP)</h1>
      <div className="grid grid-cols-9 gap-1 border-4 border-gray-600">
        {grid.map((row, rowIndex) =>
          row.map((value, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="text"
              maxLength={1}
              value={value}
              onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
              className="w-10 h-10 text-center border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))
        )}
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => alert("Validation coming soon!")}
      >
        Check Sudoku
      </button>
    </div>
  );
};

export default Sudoku;
