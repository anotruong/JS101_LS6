const readline = require('readline-sync');
const COMP_MARKER = 'O';
const INITIAL_MARKER = ' ';
const PLAYER_MARKER = 'X';

let compScore = 0;
let playerScore = 0;
let restart = '';

function prompt(msg) {
  console.log('=>', msg);
}

function displayBoard(board) {
  console.clear();

  console.log('');
  console.log('     |     |');
  console.log(`  ${board['1']}  |  ${board['2']}  |  ${board['3']}`);
  console.log('     |     |');
  console.log('-----+-----+-----');
  console.log('     |     |');
  console.log(`  ${board['4']}  |  ${board['5']}  |  ${board['6']}`);
  console.log('     |     |');
  console.log('-----+-----+-----');
  console.log('     |     |');
  console.log(`  ${board['7']}  |  ${board['8']}  |  ${board['9']}`);
  console.log('     |     |');
  console.log('');
}

function initializeBoard() {
  let obj = {};

  for (let idx = 1; idx <= 9; idx++) {
    obj[String(idx)] = INITIAL_MARKER;
  }
  return obj;
}

function boardFull(board) {
  return emptySquares(board).length === 0;
}

function comp(board) {
  let randomIdx = Math.floor(Math.random() * emptySquares(board).length);

  let compSquare = emptySquares(board)[randomIdx];

  prompt(`I'm going to play ${randomIdx}`);
  prompt('Your turn!');
  board[compSquare] = COMP_MARKER;
}

function emptySquares(board) {
  return Object.keys(board).filter(key => board[key] === INITIAL_MARKER);
}

function player(board) {
  let square;

  while (true) {
    prompt(`Please choose a square ${emptySquares(board).join(', ')}:`);
    square = readline.question().trim();

    if (emptySquares(board).includes(square)) break;

    prompt("That's not a valid choice.");
  }

  board[square] = PLAYER_MARKER;
}

function someoneWon(board) {
  return !!detectWinner(board);
}

function detectWinner(board) {
  const winCombos = [
    [1, 2, 3], [4, 5, 6], [7, 8, 9],
    [1, 4, 7], [2, 5, 8], [3, 6, 9],
    [1, 5, 9], [3, 5, 7]
  ];

  for (let line = 0; line < winCombos.length; line++) {
    let [ sq1, sq2, sq3 ] = winCombos[line];

    if (
        board[sq1] === PLAYER_MARKER &&
        board[sq2] === PLAYER_MARKER &&
        board[sq3] === PLAYER_MARKER
    ) {
      return 'Player';
    } else if (
        board[sq1] === COMP_MARKER &&
        board[sq2] === COMP_MARKER &&
        board[sq3] === COMP_MARKER
    ) {
      return 'Computer';
    }
  }

  return null;
}


let board = initializeBoard();

prompt('Welcome player to the riveting game of TicTacToe!');
prompt('Your symbol will be X and I will be O.');

displayBoard(board);

//start of the game:

while (true) {

  player(board);
  displayBoard(board);
  comp(board);
  displayBoard(board);

  if (someoneWon(board) || boardFull(board)) break;
}

if (someoneWon(board)) {
  prompt(`${detectWinner(board)} won!`)
} else {
  prompt('It\'s a tie!')
}
