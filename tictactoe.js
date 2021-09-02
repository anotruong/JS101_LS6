const readline = require('readline-sync');
const COMP_MARKER = 'O';
const INITIAL_MARKER = ' ';
const PLAYER_MARKER = 'X';
const winCombos = [
    [1, 2, 3], [4, 5, 6], [7, 8, 9],
    [1, 4, 7], [2, 5, 8], [3, 6, 9],
    [1, 5, 9], [3, 5, 7]
];


let compScore = 0;
let playerScore = 0;
let restart = '';

function prompt(msg) {
  console.log('=>', msg);
}

function displayBoard(board) {
  console.clear();

  prompt('You are X and I will be O.');
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

function defensiveManuever (line, board) {
  let markersInLine = line.map(square => board[square]);

  if (markersInLine.filter(mark => mark === PLAYER_MARKER).length === 2) {
    let unusedSquare = line.find(square => board[square] === INITIAL_MARKER);

    if (unusedSquare !== undefined) {
      return unusedSquare;
      }
  }

  return null;
}

function comp(board) {
  let square

  for (let idx = 0; idx < winCombos.length; idx++) {
    let line = winCombos[idx];
    square = defensiveManuever(line, board);
    if (square) break;
  }

  if (!square) {
    let randomIdx = Math.floor(Math.random() * emptySquares(board).length);
    square = emptySquares(board)[randomIdx];
  }

  board[compSquare] = COMP_MARKER;
}

function emptySquares(board) {
  return Object.keys(board).filter(key => board[key] === INITIAL_MARKER);
}

function joinOr(arr, punctuation = ', ', conjunction = 'or') {
  switch (arr.length) {
    case 0:
      return ' ';
    case 1:
      return `${arr}`;
    case 2:
      return `${arr.join(` ${conjunction} `)}`;
    default:
      return arr.slice(0, -1).join(punctuation) + `${punctuation}${conjunction} ${arr.slice(-1)}`;
  }
}

function player(board) {
  let square;

  while (true) {
    prompt(`Please choose a square ${joinOr(emptySquares(board))}:`);
    square = readline.question().trim();

    if (emptySquares(board).includes(square)) break;

    prompt("That's not a valid choice.");
  }

  board[square] = PLAYER_MARKER;
}

function someoneWon(board) {
  return detectWinner(board);
}

function detectWinner(board) {
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

function pointScorer(board) {
  if (detectWinner(board) === 'Player') {
    playerScore += 1;
    Object.keys(board).map(key => {
    return board[key] = INITIAL_MARKER;
    });
  } else {
    compScore += 1;
  }
}

while (true) {
  let board = initializeBoard();

  prompt('Welcome player to the riveting game of TicTacToe!');

  while (true) {

      displayBoard(board);

      console.log(playerScore)

      player(board);
      if (someoneWon(board) || boardFull(board)) {
        pointScorer(board);
      }

      if (playerScore === 5) break;

      comp(board);
      displayBoard(board);
      if (someoneWon(board) || boardFull(board)) {
        pointScorer(board);
      }

      if (compScore === 5) break;

    }

  displayBoard(board);

  if (someoneWon(board)) {
    prompt(`Final score: Player ${playerScore} | Computer ${compScore}`);
    prompt(`${detectWinner(board)} won!`);
  } else {
    prompt('It\'s a tie!');
  }

  prompt(`Would you like to play again? y/n`);
  let answer = readline.question().toLowerCase()[0];
  if (answer !== 'y') break;
}

prompt('Thanks for playing Tic Tac Toe~');
