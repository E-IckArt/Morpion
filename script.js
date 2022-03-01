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
const cup = document.getElementById('cup');
const restartButton = document.getElementById('restartButton');
const resetButton = document.getElementById('resetButton');
const startButton = document.getElementById('startButton');
let activePlayer; // to know who's turn it is
let xCounter = 0; // to know the number of rounds won by player X
let oCounter = 0; // to know the number of rounds won by player O

let player1 = document.getElementById('player1');
let player2 = document.getElementById('player2');
let input1 = document.getElementById('username1');
let input2 = document.getElementById('username2');

// Buttons are ready for action onclick
restartButton.addEventListener('click', startGame);
startButton.addEventListener('click', setPlayersNames);
resetButton.addEventListener('click', resetGame);

// Sets personnalized player names
function setPlayersNames() {
  player1.textContent = !input1.value ? ' Joueur X' : input1.value;
  player2.textContent = !input2.value ? 'Joueur O' : input2.value;

  player1 = player1.textContent;
  player2 = player2.textContent;
  newGame();
}

// Actives a new party
function newGame() {
  winningMessageElement.classList.remove('show');
  cup.classList.remove('show');
  xCounter = 0;
  oCounter = 0;
  startGame();
}

// Actives a new round
function startGame() {
  // Last player don't start first (winner or draw)
  activePlayer = !activePlayer;
  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true }); // once: true means first click action only
  });
  statut.textContent = `${activePlayer ? player2 : player1} commence`;
  setBoardHoverClass();
  // Removes the show class which disables the message
  winningMessageElement.classList.remove('show');
  cup.classList.remove('show');
  HideNamesSettings();
}

// Removes Section SetPlayerName
function HideNamesSettings() {
  document.getElementById('setPlayersName').style.display = 'none';

  startButton.removeEventListener('click', setPlayersNames);
}

// Triggers actions on click
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

// Actives a different end of game's message, depending on game state
function endGame(draw) {
  if (draw) {
    winningMessageTextElement.textContent = 'Egalité';
  } else {
    winningMessageTextElement.textContent = `${
      activePlayer ? player2 : player1
    } gagne`;

    cup.classList.add('show');
    // Increments the correct counter depending on the active player
    activePlayer ? oCounter++ : xCounter++;
    // Displays counter status
    document.getElementById('xCounter').textContent = xCounter;
    document.getElementById('oCounter').textContent = oCounter;
    /* Display player's name in tablescore */
    document.getElementById('perso1').textContent = player1;
    document.getElementById('perso2').textContent = player2;
  }
  // Adds the .show class to the .winning-message class to activate the message
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
  statut.textContent = `C'est au tour de ${activePlayer ? player2 : player1}`;
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

function resetGame() {
  cup.classList.remove('show');
  winningMessageElement.classList.remove('show');
  document.getElementById('setPlayersName').style.display = 'unset';
  document.getElementById('username1').value = '';
  document.getElementById('username2').value = '';
  document.querySelector('h2').textContent = '';
  document.getElementById('player1').textContent = 'Joueur X';
  document.getElementById('player2').textContent = 'Joueur O';
  xCounter = 0;
  oCounter = 0;

  changePlayers();
  disableClickOnBoard();
}

// Allows new players at each new party
function changePlayers() {
  player1 = document.getElementById('player1');
  player2 = document.getElementById('player2');
  startButton.addEventListener('click', setPlayersNames);
  activePlayer = player1;
}

// Clears Board & removes HandleClick when players are starting a new game
function disableClickOnBoard() {
  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.removeEventListener('click', handleClick);
  });
}

// Open Game Rules Modal
let go = document.getElementById('go');
go.addEventListener('click', displayGameRules);

// Displays or Hides game rules
function displayGameRules() {
  const display = document.getElementById('rules');
  display.style.visibility =
    display.style.visibility == 'visible' ? 'hidden' : 'visible';
}
