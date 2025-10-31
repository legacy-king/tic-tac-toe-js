// ==========================
// Gameboard Module (IIFE)
// ==========================
const Gameboard = (function() {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const setMark = (index, mark) => {
    if (board[index] === "") {
      board[index] = mark;
      return true;
    }
    return false;
  };

  const reset = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return { getBoard, setMark, reset };
})();

// ==========================
// Player Factory Function
// ==========================
const Player = (name, marker) => {
  return { name, marker };
};

// ==========================
// Game Controller Module
// ==========================
const GameController = (function() {
  let player1;
  let player2;
  let activePlayer;
  let gameOver = false;

  const startGame = (name1, name2) => {
    player1 = Player(name1 || "Player 1", "X");
    player2 = Player(name2 || "Player 2", "O");
    activePlayer = player1;
    gameOver = false;
    Gameboard.reset();
    DisplayController.render();
    DisplayController.setMessage(`${activePlayer.name}'s turn`);
  };

  const playRound = (index) => {
    if (gameOver) return;

    if (Gameboard.setMark(index, activePlayer.marker)) {
      DisplayController.render();
      if (checkWin(Gameboard.getBoard(), activePlayer.marker)) {
        DisplayController.setMessage(`${activePlayer.name} wins!`);
        gameOver = true;
      } else if (isDraw(Gameboard.getBoard())) {
        DisplayController.setMessage("It's a draw!");
        gameOver = true;
      } else {
        switchPlayer();
        DisplayController.setMessage(`${activePlayer.name}'s turn`);
      }
    }
  };

  const switchPlayer = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
  };

  const checkWin = (board, marker) => {
    const winningCombos = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    return winningCombos.some(combo =>
      combo.every(index => board[index] === marker)
    );
  };

  const isDraw = (board) => board.every(cell => cell !== "");

  return { startGame, playRound };
})();

// ==========================
// Display Controller Module
// ==========================
const DisplayController = (function() {
  const cells = document.querySelectorAll(".cell");
  const messageDisplay = document.getElementById("message");
  const startBtn = document.getElementById("startBtn");

  const render = () => {
    const board = Gameboard.getBoard();
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };

  const setMessage = (msg) => {
    messageDisplay.textContent = msg;
  };

  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
      const index = cell.dataset.index;
      GameController.playRound(index);
    });
  });

  startBtn.addEventListener("click", () => {
    const name1 = document.getElementById("player1").value;
    const name2 = document.getElementById("player2").value;
    GameController.startGame(name1, name2);
  });

  return { render, setMessage };
})();
