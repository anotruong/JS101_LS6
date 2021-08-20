const readline = require('readline-sync');
const positions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const winCombos = {
      '1': [1, 2, 3],
      '2': [4, 5, 6],
      '3': [7, 8, 9],
      '4': [1, 4, 7],
      '5': [2, 5, 8],
      '6': [3, 6, 9],
      '7': [1, 5, 9],
      '8': [3, 5, 7]
}

let compMoves = [];
let compScore = 0;
let playerMoves = [];
let playerScore = 0;

function prompt(msg) {
      console.log(msg)
}

function displayBoard(board) {
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
    };

function initializeBoard() {
      let obj = {
            '1': 1,
            '2': 2,
            '3': 3,
            '4': 4,
            '5': 5,
            '6': 6,
            '7': 7,
            '8': 8
      };

      // for (let sqr = 0; sqr <= 9; sqr++) {
      //       obj[String(sqr)] = ' ';
      // }
      return obj;
}

function randomizer() {
      let move = Math.floor(Math.random() * (9 - 1));
      return move;
}

function comp() {
      if (!playerMoves.includes(move) && !compMoves.includes(move)){
            compMoves.push(move);
            board[String(move)] = 'O';
      }
      displayBoard(board)
}

function player(num) {
      if (!playerMoves.includes(num) && !compMoves.includes(num)) {
            playerMoves.push(num);
            board[String(num)] = 'X';
      }
      displayBoard(board)
};

let board = initializeBoard();

while (true) {

      prompt('Welcome player to the riveting game of TicTacToe!');

      prompt('Your symbol will be X and I will be 0.')

      displayBoard(board);

      prompt('Enter the number of the position you want to play');
      let answer = readline.question();

      while (!positions.includes(answer)) {
            prompt("That's not a valid choice, there are only 9 positions!");
            answer = readline.question();
          }

      playerMoves(answer);

      comp();

      for (let i = 1; i <= 8; i++) {
            if (winCombos[String(i)].every(num => playerMoves.includes(num))) {
                  playerScore++;
                  prompt('Congratulations, you won!');
                  prompt(`Player : ${playerScore} | Comp: ${compScore}`)
            } else if (winCombos[String(i)].every(num => compMoves.includes(num))) {
                  compScore++;
                  prompt('Aww shucks, looks like the computer won.');
                  prompt(`Player : ${playerScore} | Comp: ${compScore}`)
            } else {
                  prompt('Looks like no one won becaues it\'s a tie.')
            }
      }

      prompt("Do you want to play again? (y/n?)")
      let restart = readline.question().toLowerCase();
      while (restart[0] !== 'n' && restart[0] !== 'y') {
        prompt('Please enter "y" or "n".');
        restart = readline.question().toLowerCase();
      }
      if (restart[0] !== 'y') break;
}

