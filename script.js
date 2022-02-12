const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const WINNING_COMBINATIONS = [
  // Combinaisons horizontales
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  //Combinaisons verticales
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Combinaisons en diagonale
  [0, 4, 8],
  [2, 4, 6],
];
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winning-message');
const restartButton = document.getElementById('restartButton');
const winningMessageTextElement = document.querySelector(
  '[data-winning-message-text]'
);
let circleTurn; // Variable pour savoir qui doit jouer

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
  circleTurn = false;
  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true }); // once: true = action au premier click seulement
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove('show');
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  // placeMark
  placeMark(cell, currentClass);
  // Check for Win
  if (checkWin(currentClass)) {
    // Check for Win
    endGame(false);
  } else if (isDraw()) {
    // Check for draw
    endGame(true);
  } else {
    // Switch Turns & active shadow
    swapTurns();
    setBoardHoverClass();
  }
}

// Déclenche le message à la fin de la partie
function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = 'Draw !';
  } else {
    winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`;
  }
  winningMessageElement.classList.add('show');
}

// Vérifie si toutes les cases sont remplies
function isDraw() {
  return [...cellElements].every((cell) => {
    return (
      cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    );
  });
}
//Mark la case au click et interdit le marquage d'une case déjà occupée
function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

//Change de joueur à chaque tour
function swapTurns() {
  circleTurn = !circleTurn;
}

// Active les mark's shadows
function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(CIRCLE_CLASS);

  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

// Vérifie s'il y a une combinaison gagnante
function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return cellElements[index].classList.contains(currentClass);
    });
  }); // Return true if there is any winning combination of the array
}
