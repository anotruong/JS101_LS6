//Board Set Up

const readline = require('readline-sync');
const COMP_MARKER = 'O';
const GAME_BORDER = '-----+-----+-----+-----+-----';
const GAME_SPACES = '     |     |     |     |';
const INITIAL_MARKER = ' ';
const HUMAN_MARKER = 'X';
const MAX_SCORE = 5;
const WIN_COMBOS = [
  [1, 2, 3, 4], [2, 3, 4, 5], [6, 7, 8, 9], [7, 8, 9, 10], [11, 12, 13, 14],
  [12, 13, 14, 15], [16, 17, 18, 19], [17, 18, 19, 20], [21, 22, 23, 24],
  [22, 23, 24, 25], //across
  [1, 6, 11, 16], [6, 11, 16, 21], [2, 7, 12, 17], [7, 12, 17, 22],
  [3, 8, 13, 18], [8, 13, 18, 23], [4, 9, 14, 19], [9, 14, 19, 24],
  [5, 10, 15, 20], [10, 15, 20, 25], //horizontal
  [6, 12, 18, 24], [1, 7, 13, 19], [7, 13, 19, 25], [2, 8, 14, 20],
  [4, 8, 12, 16], [10, 14, 18, 22] //diagonal
];
const YES_NO = ['y', 'yes', 'n', 'no', 'r', 'random'];

let compScore = 0;
let humanScore = 0;

function prompt(msg) {
  console.log('=>', msg);
}

function displayBoard(board) {
  console.clear();

  let row = {
    1: `  ${board['1']}  |  ${board['2']}  |  ${board['3']}  |  ${board['4']}  |  ${board['5']}`,
    2: `  ${board['6']}  |  ${board['7']}  |  ${board['8']}  |  ${board['9']}  |  ${board['10']}`,
    3: `  ${board['11']}  |  ${board['12']}  |  ${board['13']}  |  ${board['14']}  |  ${board['15']}`,
    4: `  ${board['16']}  |  ${board['17']}  |  ${board['18']}  |  ${board['19']}  |  ${board['20']}`,
    5: `  ${board['21']}  |  ${board['22']}  |  ${board['23']}  |  ${board['24']}  |  ${board['25']}`
  };

  let divisibleByFour = 1;

  for (let assignRows = 2; assignRows <= 18; assignRows += 2) {
    if (assignRows / 4 === divisibleByFour) {
      console.log(`${GAME_SPACES} \n${GAME_BORDER}`);
      divisibleByFour += 1;
    } else {
      console.log(`${GAME_SPACES} \n${row[divisibleByFour]}`);
    }
  }
  console.log(`${GAME_SPACES} \n`);
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
    board[key] = INITIAL_MARKER;
    return null;
  });
}

function emptySquares(board) {
  return Object.keys(board).filter(key => board[key] === INITIAL_MARKER);
}

function scoreBoard() {
  console.log('|------------- SCORE BOARD -------------|');
  console.log(`|    Human: ${humanScore}     |     Computer: ${compScore}     |`);
  console.log('|---------------------------------------|\n');
}

//Players functions

function comp(board) {
  for (let idx = 0; idx < WIN_COMBOS.length; idx++) {
    let line = WIN_COMBOS[idx];
    let square;
    let square1 = findAtRiskSquare(line, board, COMP_MARKER);
    let square2 = findAtRiskSquare(line, board, HUMAN_MARKER);

    if (!square1) {
      if (!square2) {
	let randomIdx = Math.floor(Math.random() * emptySquares(board).length);
        square = emptySquares(board)[randomIdx];
        break;
      } else {
        board[square2] = COMP_MARKER;
        break;
      }
    } else {
      board[square1] = COMP_MARKER;
      break;
    }
  }
}

/*function comp(board) {
  let square;

  for (let idx = 0; idx < winCombos.length; idx++) {
    let line = winCombos[idx];
    square = findAtRiskSquare(line, board, COMP_MARKER);
    if (square) break;
  }

  if (!square) {
    for (let idx = 0; idx < WIN_COMBOS.length; idx++) {
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
}*/

function human(board) {
  let square;

  while (true) {
    prompt(`Please choose a square ${joinOr(emptySquares(board))}:`);
    square = readline.question().trim();

    if (emptySquares(board).includes(square)) break;

    prompt("That's not a valid choice.");
  }

  board[square] = HUMAN_MARKER;
  return null;
}

//Game Functions

function alternatePlayer(player) {
  if (player === 'human') {
    return 'comp';
  } else {
    return 'human';
  }
}

function chooseSquare(board, currentPlayer) {
  if (currentPlayer === 'human') {
    human(board);
  } else {
    comp(board);
  }
  return null;
}

//Occationally does not detect wins that are made with diagonal array.
//also need to figure out how to shorten this function.
function detectWinner(board) {
  for (let line = 0; line < WIN_COMBOS.length; line++) {
    let [ sq1, sq2, sq3, sq4 ] = WIN_COMBOS[line];
    if (
      board[sq1] === HUMAN_MARKER &&
         board[sq2] === HUMAN_MARKER &&
            board[sq3] === HUMAN_MARKER &&
            board[sq4] === HUMAN_MARKER
    ) {
      return 'human';
    } else if (
      board[sq1] === COMP_MARKER &&
            board[sq2] === COMP_MARKER &&
            board[sq3] === COMP_MARKER &&
            board[sq4] === COMP_MARKER
    ) {
      return 'comp';
    }
  }
  return null;
}

function enterToContinue() {
  prompt("Let me know when you're ready to play again.\n");
  prompt("Press 'Enter' to continue.");

  let userInput = readline.question().toLowerCase();

  while (userInput === false) {
    prompt("Meep, something went wrong. You can press 'Enter' or any key to continue");
    userInput = readline.question().toLowerCase();
  }
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

function pointScorer(board) {
  if (detectWinner(board) === 'human') {
    humanScore += 1;
  } else {
    compScore += 1;
  }
  scoreBoard();
  enterToContinue();
  clearBoard(board);
}

function someoneWon(board) {
  return detectWinner(board);
}

function winOrFull(board) {
  if (someoneWon(board)) {
    displayBoard(board);
    pointScorer(board);
  } else if (boardFull(board)) {
    displayBoard(board);
  }
}

let random = () => Math.floor(Math.random() * 2);

while (true) {
  let board = initializeBoard();

  prompt('Welcome human to the riveting game of TicTacToe!');
  prompt("It's easy to play, but not easy to win.");
  prompt("We are playing the long game, whoever gets 5 points first wins!\n");

  prompt("Would you like to go first or randomize it? yes/no/random");
  let currentPlayer = readline.question().toLowerCase()[0];

  while (!YES_NO.includes(currentPlayer)) {
    prompt("That's not a valid choice");
    currentPlayer = readline.question().toLowerCase()[0];
  }

  if (currentPlayer === 'r') {
    currentPlayer = (random() === 0) ? 'human' : 'comp';
  } else {
    currentPlayer = (currentPlayer === 'y') ? 'human' : 'comp';
  }

  do {

    displayBoard(board);

    scoreBoard();

    prompt('You are X and I am O');
    chooseSquare(board, currentPlayer);
    currentPlayer = alternatePlayer(currentPlayer);
    winOrFull(board);
    console.clear();

  } while ((humanScore || compScore) < MAX_SCORE);
  displayBoard(board);

  scoreBoard();

  if (compScore === MAX_SCORE) {
    prompt(`Computer wins!`);
  } else if (humanScore === MAX_SCORE) {
    prompt('Human wins!');
  } else {
    prompt('It\'s a tie!');
  }

  prompt(`Would you like to play again? yes/no`);
  let answer = readline.question().toLowerCase();

  while (!YES_NO.includes(answer)) {
    prompt("That answer is invalid. Would you like to play again or exit the game? y/n");
    answer = readline.question().toLowerCase();
  }

  if (answer !== 'y') break;

  compScore = 0;
  humanScore = 0;
  console.clear();
}

prompt('Thanks for playing Tic Tac Toe~');
