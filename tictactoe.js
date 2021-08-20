const readline = require('readline-sync');
const positions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const winCombos = {
  1: [1, 2, 3],
  2: [4, 5, 6],
  3: [7, 8, 9],
  4: [1, 4, 7],
  5: [2, 5, 8],
  6: [3, 6, 9],
  7: [1, 5, 9],
  8: [3, 5, 7]
};

let compMoves = [];
let compScore = 0;
let playerMoves = [];
let playerScore = 0;
let restart = '';

function prompt(msg) {
  console.log(msg);
}

function displayBoard(spot) {
  console.log('');
  console.log('     |     |');
  console.log(`  ${spot['1']}  |  ${spot['2']}  |  ${spot['3']}`);
  console.log('     |     |');
  console.log('-----+-----+-----');
  console.log('     |     |');
  console.log(`  ${spot['4']}  |  ${spot['5']}  |  ${spot['6']}`);
  console.log('     |     |');
  console.log('-----+-----+-----');
  console.log('     |     |');
  console.log(`  ${spot['7']}  |  ${spot['8']}  |  ${spot['9']}`);
  console.log('     |     |');
  console.log('');
}

function initializeBoard() {
  let obj = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9
  };

  // for (let sqr = 0; sqr <= 9; sqr++) {
  //       obj[String(sqr)] = ' ';
  // }
  return obj;
}

function randomizer() {
  let num = Math.floor(Math.random() * (9 - 1));
  return num;
}

let board = initializeBoard();

function comp() {
  let move = randomizer();
  while (!playerMoves.includes(move) && !compMoves.includes(move)) {
    compMoves.push(move);
    board[String(move)] = 'O';
  }
  displayBoard(board);
}

function player(num) {
  if (!playerMoves.includes(num) && !compMoves.includes(num)) {
    playerMoves.push(num);
    board[String(num)] = 'X';
  }
  displayBoard(board);
}

function resetting() {
  prompt("Do you want to play again? (y/n?)");
  restart = readline.question().toLowerCase();

  while (restart[0] !== 'n' && restart[0] !== 'y') {
    prompt('Please enter "y" or "n".');
    restart = readline.question().toLowerCase();
  }
  return restart;
}

while (true) {

  prompt('Welcome player to the riveting game of TicTacToe!');

  prompt('Your symbol will be X and I will be O.');

  displayBoard(board);

  prompt('Enter the number of the position you want to play');
  let answer = readline.question();

  while (!positions.includes(Number(answer))) {
    prompt("That's not a valid choice, there are only 9 positions!");
    answer = readline.question();
  }

  player(answer);

  comp();

  for (let i = 1; i <= 8; i++) {
    if (winCombos[String(i)].every(num => playerMoves.includes(num))) {
      playerScore++;
      prompt('Congratulations, you won!');
      prompt(`Player : ${playerScore} | Comp: ${compScore}`);
      resetting();
    } else if (winCombos[String(i)].every(num => compMoves.includes(num))) {
      compScore++;
      prompt('Aww shucks, looks like the computer won.');
      prompt(`Player : ${playerScore} | Comp: ${compScore}`);
      resetting();
    } else if (Object.values(board).every(sym => sym === 'O' || sym === 'X')) {
      prompt('Looks like no one won becaues it\'s a tie.');
      resetting();
    }
  }

  if (restart[0] !== 'y') break;
}

