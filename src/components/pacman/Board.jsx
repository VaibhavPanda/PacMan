import React from "react";

export default function Board({ board, ghosts }) {
  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          let className = "cell";

          if (cell === 1) className += " wall";
          else if (cell === 2) className += " pellet";
          else if (cell === 3) className += " pacman";

          const isGhost = ghosts.some(
            (g) => g.row === rowIndex && g.col === colIndex
          );
          if (isGhost) className += " ghost";

          return <div className={className} key={`${rowIndex}-${colIndex}`} />;
        })
      )}
    </div>
  );
}
