const readline = require('readline-sync');
const COMP_MARKER = 'O';
const INITIAL_MARKER = ' ';
const HUMAN_MARKER = 'X';
const winCombos = [
  [1, 2, 3], [4, 5, 6], [7, 8, 9],
  [1, 4, 7], [2, 5, 8], [3, 6, 9],
  [1, 5, 9], [3, 5, 7]
];


let compScore = 0;
let humanScore = 0;
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

function clearBoard(board) {
  Object.keys(board).map(key => {
    return board[key] = INITIAL_MARKER;
  });
}

function findAtRiskSquare (line, board, marker) {
  let markersInLine = line.map(square => board[square]);

  if (markersInLine.filter(mark => mark === marker).length === 2) {
  let unusedSquare = line.find(square => board[square] === INITIAL_MARKER);

    if (unusedSquare !== undefined) {
      return unusedSquare;
    }
  }
  return null;
}

function comp(board) {
  let square;

  if (board[5] === INITIAL_MARKER) {
    return board[5] = COMP_MARKER;
  }


  for (let idx = 0; idx < winCombos.length; idx++) {
    let line = winCombos[idx];
    square = findAtRiskSquare(line, board, COMP_MARKER);
    if (square) break;
  }

  if (!square) {
  for (let idx = 0; idx < winCombos.length; idx++) {
    let line = winCombos[idx];
    square = findAtRiskSquare(line, board, HUMAN_MARKER);
    if (square) break;
   }
  }

  if (!square) {
    let randomIdx = Math.floor(Math.random() * emptySquares(board).length);
    square = emptySquares(board)[randomIdx];
  }

  board[square] = COMP_MARKER;
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

function human(board) {
  let square;

  while (true) {
    prompt(`Please choose a square ${joinOr(emptySquares(board))}:`);
    square = readline.question().trim();

    if (emptySquares(board).includes(square)) break;

    prompt("That's not a valid choice.");
  }

  board[square] = HUMAN_MARKER;
}

function someoneWon(board) {
  return detectWinner(board);
}

function detectWinner(board) {
  for (let line = 0; line < winCombos.length; line++) {
    let [ sq1, sq2, sq3 ] = winCombos[line];

    if (
      board[sq1] === HUMAN_MARKER &&
        board[sq2] === HUMAN_MARKER &&
        board[sq3] === HUMAN_MARKER
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

function alternatePlayer(player) {
  if (player === 'human') {
    return 'comp';
  } else {
    return 'human';
  }
}

function chooseSquare(board, currentPlayer) {
  if (currentPlayer === 'human') {
    return human(board);
  } else {
    return comp(board);
  }
}

function pointScorer(board) {
  if (detectWinner(board) === 'human') {
    humanScore += 1;
  } else {
    compScore += 1;
  }
  prompt(`Looks like ${detectWinner(board)} won this round, ready for the next round? yes or yes?`)
  let answer = readline.question().toLowerCase();

  if (answer === 'yes') {
    clearBoard(board);
  }
}

function winOrFull(board) {
  if (someoneWon(board)) {
    pointScorer(board);
  } else if (boardFull(board)) {
    prompt("Looks like the board is full, ready for the next round? y/n")
    let answer = readline.question().toLowerCase();

    if (answer === 'y') {
    clearBoard(board);
    }
  }
}

while (true) {
  let board = initializeBoard();

  prompt('Welcome player to the riveting game of TicTacToe!');

  prompt("Would you like to go first? y/n")

  let currentPlayer = readline.question().toLowerCase()[0];

/*  while ((!currentPlayer.includes('y')) || (!currentPlayer.includes('n'))) {
    prompt("That's not a valid choice");
    currentPlayer = readline.question().toLowerCase()[0];
  }*/

  switch (currentPlayer) {
    case 'y':
      currentPlayer = human;
      break;
    case 'n':
      currentPlayer = comp;
      break;
  }

  while (true) {

    displayBoard(board);

    prompt(`Current score: Human ${humanScore} | Computer ${compScore}`);

    chooseSquare(board, currentPlayer);
    currentPlayer = alternatePlayer(currentPlayer);
    winOrFull(board);

    if (humanScore === 5) break;

    if (compScore === 5) break;
  }

  displayBoard(board);
  prompt(`Final score: Human ${humanScore} | Computer ${compScore}`);

  if (compScore === 5) {
    prompt(`Computer wins!`);
  } else if (playerScore === 5) {
    prompt('Human wins!');
  } else {
    prompt('It\'s a tie!');
  }

  prompt(`Would you like to play again? y/n`);
  let answer = readline.question().toLowerCase()[0];
  if (answer !== 'y') break;
}

prompt('Thanks for playing Tic Tac Toe~');
