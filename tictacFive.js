const readline = require('readline-sync');
const COMP_MARKER = 'O';
const INITIAL_MARKER = ' ';
const HUMAN_MARKER = 'X';
const winCombos = [
  [1, 2, 3, 4], [2, 3, 4, 5], [6, 7, 8, 9], [7, 8, 9, 10], [11, 12, 13, 14],
  [12, 13, 14, 15], [16, 17, 18, 19], [17, 18, 19, 20], [21, 22, 23, 24],
  [22, 23, 24, 25], //across
  [1, 6, 11, 16], [6, 11, 16, 21], [2, 7, 12, 17], [7, 12, 17, 22],
  [3, 8, 13, 18], [8, 13, 18, 23], [4, 9, 14, 19], [9, 14, 19, 24],
  [5, 10, 15, 20], [10, 15, 20, 25], //horizontal
  [6, 12, 18, 24], [1, 7, 13, 19], [7, 13, 19, 25], [2, 8, 14, 20],
  [4, 8, 12, 16], [10, 14, 18, 22] //diagonal
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
console.log('     |     |     |     |');
console.log(`  ${board['1']}  |  ${board['2']}  |  ${board['3']}  |  ${board['4']}  |  ${board['5']}`);
console.log('     |     |     |     |');
console.log('-----+-----+-----+-----+-----');
console.log('     |     |     |     |');
console.log(`  ${board['6']}  |  ${board['7']}  |  ${board['8']}  |  ${board['9']}  |  ${board['10']}`);
console.log('     |     |     |     |');
console.log('-----+-----+-----+-----+-----');
console.log('     |     |     |     |');
console.log(`  ${board['11']}  |  ${board['12']}  |  ${board['13']}  |  ${board['14']}  |  ${board['15']}`);
console.log('     |     |     |     |');
console.log('-----+-----+-----+-----+-----');
console.log('     |     |     |     |');
console.log(`  ${board['16']}  |  ${board['17']}  |  ${board['18']}  |  ${board['19']}  |  ${board['20']}`);
console.log('     |     |     |     |');
console.log('-----+-----+-----+-----+-----');
console.log('     |     |     |     |');
console.log(`  ${board['21']}  |  ${board['22']}  |  ${board['23']}  |  ${board['24']}  |  ${board['25']}`);
console.log('     |     |     |     |');
console.log('');
}

function initializeBoard() {
  let obj = {};

  for (let idx = 1; idx <= 25; idx++) {
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

  if (markersInLine.filter(mark => mark === marker).length === 3) {
  let unusedSquare = line.find(square => board[square] === INITIAL_MARKER);

    if (unusedSquare !== undefined) {
      return unusedSquare;
    }
  }
  return null;
}

function comp(board) {
  let square;

  if (board[13] === INITIAL_MARKER) {
    return board[13] = COMP_MARKER;
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
    let [ sq1, sq2, sq3, sq4 ] = winCombos[line];

    if (
      board[sq1] === HUMAN_MARKER &&
        board[sq2] === HUMAN_MARKER &&
        board[sq3] === HUMAN_MARKER &&
        board[sq4] === HUMAN_MARKER
    ) {
      return 'Player';
    } else if (
      board[sq1] === COMP_MARKER &&
        board[sq2] === COMP_MARKER &&
        board[sq3] === COMP_MARKER &&
        board[sq4] === COMP_MARKER
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
  } else if (currentPlayer === 'comp') {
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
    displayBoard(board);
    pointScorer(board);
  } else if (boardFull(board)) {
    displayBoard(board);
    prompt("Looks like the board is full, ready for the next round? Type 'yes'.")
    let answer = readline.question().toLowerCase()[0];

    while (!(answer.includes('y'))) {
      prompt("That's not the proper answer. Let me know when you are ready for the next round. Type 'yes'.");
    };

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

  while (!((currentPlayer.includes('y')) || (!currentPlayer.includes('n')))) {
    prompt("That's not a valid choice");
    currentPlayer = readline.question().toLowerCase()[0];
  }

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

  while (!((answer.includes('y') || (answer.includes('n')))) {
    prompt('That answer is invalid. Would you like to play again or exit the game? y/n');
    answer = readline.question().toLowerCase()[0];
  }

  if (answer !== 'y') break;
}

prompt('Thanks for playing Tic Tac Toe~');
