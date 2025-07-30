import React, { useEffect, useState } from "react";
import Board from "./Board";
import "./style.css";

const initialBoard = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
  [1, 2, 1, 2, 2, 2, 2, 1, 2, 1],
  [1, 2, 1, 2, 1, 1, 2, 1, 2, 1],
  [1, 2, 2, 2, 1, 3, 2, 2, 2, 1],
  [1, 2, 1, 2, 1, 1, 2, 1, 2, 1],
  [1, 2, 1, 2, 2, 2, 2, 1, 2, 1],
  [1, 2, 2, 2, 1, 1, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];



const ghostStartPositions = [
  { row: 1, col: 1 },
  { row: 1, col: 10 },
];

const directions = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

function Pacman() {
  const [board, setBoard] = useState(initialBoard);
  const [pacman, setPacman] = useState({ row: 5, col: 5 });
  const [ghosts, setGhosts] = useState(ghostStartPositions);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [youWin,setYouWin] = useState(false);

  const movePacman = (dir) => {
    if (gameOver) return;

    const moves = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    };

    const [dr, dc] = moves[dir] || [0, 0];
    const newRow = pacman.row + dr;
    const newCol = pacman.col + dc;

    if (
      newRow >= 0 &&
      newRow < board.length &&
      newCol >= 0 &&
      newCol < board[0].length &&
      board[newRow][newCol] !== 1
    ) {
      const newBoard = board.map((row) => row.slice());

      if (newBoard[newRow][newCol] === 2) {
        setScore((prev) => prev + 10);
      }

      newBoard[pacman.row][pacman.col] = 0;
      newBoard[newRow][newCol] = 3;

      setBoard(newBoard);
      setPacman({ row: newRow, col: newCol });

      if(checkWin()){
        setYouWin(true);
        setTimeout(() => {
          restartGame();
          setYouWin(false);
        }, 2000);
      }
      ghosts.forEach((g) => {
        if (g.row === newRow && g.col === newCol) {
          loseLife();
        }
      });
    }
  };

  const checkWin =()=>{
    for(let row of board){
      for(let cell of row){
        if(cell===2) return false;
      }
    }
    return true;  
  }

  const moveGhosts = () => {
    const updatedGhosts = ghosts.map((ghost) => {
      const validMoves = [];

      directions.forEach((dir) => {
        const moves = {
          ArrowUp: [-1, 0],
          ArrowDown: [1, 0],
          ArrowLeft: [0, -1],
          ArrowRight: [0, 1],
        };

        const [dr, dc] = moves[dir];
        const newRow = ghost.row + dr;
        const newCol = ghost.col + dc;

        if (
          newRow >= 0 &&
          newRow < board.length &&
          newCol >= 0 &&
          newCol < board[0].length &&
          board[newRow][newCol] !== 1
        ) {
          validMoves.push({ row: newRow, col: newCol });
        }
      });

      if (validMoves.length > 0) {
        const next = validMoves[Math.floor(Math.random() * validMoves.length)];
        // Check collision with Pacman
        if (next.row === pacman.row && next.col === pacman.col) {
          loseLife();
        }
        return next;
      }
      return ghost;
    });

    setGhosts(updatedGhosts);
  };

  const loseLife = () => {
    setLives((prev) => {
      if (prev <= 1) {
        setGameOver(true);
        return 0;
      }
      return prev - 1;
    });
    setPacman({ row: 3, col: 3 });
  };

  const restartGame = () => {
    setBoard(initialBoard.map(row => row.slice()));
    setPacman({ row: 3, col: 3 });
    setGhosts(ghostStartPositions);
    setScore(0);
    setLives(3);
    setGameOver(false);
    setYouWin(false);
    
  };

  useEffect(() => {
    const handleKeyDown = (e) => movePacman(e.key);
    window.addEventListener("keydown", handleKeyDown);

    const ghostInterval = setInterval(() => {
      if (!gameOver) moveGhosts();
    }, 800);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(ghostInterval);
    };
  }, [pacman, ghosts, gameOver]);

  return (
    <div className="game-container">
      <h1>Pacman React</h1>
      <div className="score">Score: {score}</div>
      <div className="lives">Lives: {lives}</div>
      {gameOver && <div className="game-over">💀 Game Over!</div>}
      {youWin && <div className="game-win">🎉 You Win!</div>}
      <Board board={board} ghosts={ghosts} />
      {gameOver && (
        <button className="restart-button" onClick={restartGame}>
          🔄 Restart
        </button>
      )}
    </div>
  );
}

export default Pacman;
