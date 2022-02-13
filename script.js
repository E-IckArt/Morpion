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
const statut = document.querySelector('h2');
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winning-message');
const winningMessageTextElement = document.querySelector(
  '[data-winning-message-text]'
);
const restartButton = document.getElementById('restartButton');
const resetButton = document.getElementById('resetButton');
let activePlayer; // to know who's turn it is
let xCounter = 0;
let oCounter = 0;

newGame();

// Buttons are ready for action onclick
restartButton.addEventListener('click', startGame);
resetButton.addEventListener('click', newGame);

// Actives a new party
function newGame() {
  startGame();
  xCounter = 0;
  oCounter = 0;
}

// Actives a new round
function startGame() {
  activePlayer = !activePlayer; // Last player don't start first (winner or draw)
  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true }); // once: true means first click action only
  });
  statut.innerHTML = `Joueur ${activePlayer ? 'O' : 'X'} commence`;
  setBoardHoverClass();
  winningMessageElement.classList.remove('show');
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = activePlayer ? CIRCLE_CLASS : X_CLASS;
  // placeMark
  placeMark(cell, currentClass);
  // Checks for end of game
  if (checkWin(currentClass)) {
    // Checks for Win
    endGame(false);
  } else if (isDraw()) {
    // Checks for draw
    endGame(true);
  } else {
    // Switches Turns & active mark's shadow
    swapTurns();
    setBoardHoverClass();
  }
}

// Actives end of game's message
function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = 'Egalité';
  } else {
    winningMessageTextElement.innerText = `Joueur ${
      activePlayer ? 'O' : 'X'
    } gagne`;
    if (activePlayer) {
      oCounter += 1;
    } else {
      xCounter += 1;
    }
    document.getElementById('xCounter').innerHTML = xCounter;
    document.getElementById('oCounter').innerHTML = oCounter;
  }

  winningMessageElement.classList.add('show');
}

// Checks if all boxes are full
function isDraw() {
  return [...cellElements].every((cell) => {
    return (
      cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    );
  });
}
//Marks box onclick and forbid marks on taken boxes
function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

//Switches players at every turn
function swapTurns() {
  activePlayer = !activePlayer;
  //if ()
  statut.innerHTML = `C'est au tour du joueur ${activePlayer ? 'O' : 'X'}`;
}

// Actives mark's shadows
function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(CIRCLE_CLASS);

  if (activePlayer) {
    board.classList.add(CIRCLE_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

// Checks if there is a winning combination
function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return cellElements[index].classList.contains(currentClass);
    });
  }); // Return true if there is any winning combination of the array
}
