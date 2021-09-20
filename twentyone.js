//Game play//
const readline = require('readline-sync');
const EMPTY_DISPLAY = '            ';
const FIFTY_TWO_CARDS = [
  ['C', 'A'], ['D', 'A'], ['H', 'A'], ['S', 'A'],
  ['C', '2'], ['D', '2'], ['H', '2'], ['S', '2'],
  ['C', '3'], ['D', '3'], ['H', '3'], ['S', '3'],
  ['C', '4'], ['D', '4'], ['H', '4'], ['S', '4'],
  ['C', '5'], ['D', '5'], ['H', '5'], ['S', '5'],
  ['C', '6'], ['D', '6'], ['H', '6'], ['S', '6'],
  ['C', '7'], ['D', '7'], ['H', '7'], ['S', '7'],
  ['C', '8'], ['D', '8'], ['H', '8'], ['S', '8'],
  ['C', '9'], ['D', '9'], ['H', '9'], ['S', '9'],
  ['C', '10'], ['D', '10'], ['H', '10'], ['S', '10'],
  ['C', 'J'], ['D', 'J'], ['H', 'J'], ['S', 'J'],
  ['C', 'Q'], ['D', 'Q'], ['H', 'Q'], ['S', 'Q'],
  ['C', 'K'], ['D', 'K'], ['H', 'K'], ['S', 'K']
];
const HIT_STAY = ['hit', 'stay'];
const MAX_SCORE = 21;
const NO_YES = ['yes', 'no'];

let dealersHand = [];
let hiddenScore = 0;
let playersHand = [];

//DISPLAY BOARD INFO//

function displayBoard(board) {
  console.clear();

  console.log('|              |              |');
//  console.log(`|  PLAYER: ${sumOfHand(playersHand).length}  |  DEALER: ${kerning(hiddenScore)}  |`);
  console.log(`|  PLAYER: ${kerning(sumOfHand(playersHand))}  |  DEALER: ${kerning(hiddenScore)}  |`);
  console.log('|--------------|--------------|');
  console.log(`| ${board['0']} | ${board['1']} |`);
  console.log(`| ${board['2']} | ${board['3']} |`);
  console.log(`| ${board['4']} | ${board['5']} |`);
  console.log(`| ${board['6']} | ${board['7']} |`);
  console.log(`| ${board['8']} | ${board['9']} |`);
  console.log(`| ${board['10']} | ${board['11']} |`);
  console.log('|--------------|--------------|');
}

function kerning(score) {
  if (String(score).length === 2) {
    return `${score}`;
  } else {
   return score + ' ';
  }
}

function displayCard(subArr) {
  if (subArr[1].length === 2) {
    return '[  ' + subArr[0] + ',  ' + subArr[1] + '  ]';
  } else {
    return '[  ' + subArr[0] + ',  ' + subArr[1] + '  ] ';
  }
}

function displayHand(hand) {
  console.log(hand);
}

function initializeBoard() {
  let obj = {};

  for (let idx = 0; idx <= 11; idx++) {
    obj[String(idx)] = EMPTY_DISPLAY;
  }

  return obj;
}

function prompt(msg) {
  console.log(`=> ${msg}`);
}

//GAMEPLAY FUNCTIONS//

function busted() {
  if (sumOfHand(playersHand) >= MAX_SCORE) {
      return true;
    } else if (sumOfHand(dealersHand) >= MAX_SCORE) {
      return true;
    }
}

function dealersHiddenCard(ele) {
  let sum = 0;

  if (['J', 'Q', 'K']. includes(ele)) {
    sum += 10;
  } else if (ele === 'A') {
    sum += 11;
  } else {
    sum += Number(ele);
  }
  return sum;
}

function enterToContinue() {
  prompt("Press 'Enter' to continue.");

  let userInput = readline.question().toLowerCase();

  while (userInput === false) {
    prompt("Meep, something went wrong. You can press 'Enter' or any key to continue");
    userInput = readline.question().toLowerCase();
  };
}

function sumOfHand(player) {
  let sum = 0;

  player.map(num => num[1]).forEach(ele => {
    if (['J', 'Q', 'K']. includes(ele)) {
      sum += 10;
    } else if (ele === 'A') {
      sum += 11;
    } else {
      sum += Number(ele);
    }
  });

  player.filter(value => value === 'A').forEach(_ => {
    if (sum > MAX_SCORE) sum -= 10;
  });

  return sum;
}

function shuffle(FIFTY_TWO_CARDS) {
  for (let index = FIFTY_TWO_CARDS.length - 1; index > 0; index--) {
    let otherIndex = Math.floor(Math.random() * (index + 1)); // 0 to index
    [FIFTY_TWO_CARDS[index], FIFTY_TWO_CARDS[otherIndex]] = [FIFTY_TWO_CARDS[otherIndex], FIFTY_TWO_CARDS[index]]; // swap elements
  }
  return FIFTY_TWO_CARDS;
}


//Create a function that only returns the result of the game
//calculating the result.

function whoWon() {
  if (sumOfHand(dealersHand) < sumOfHand(playersHand) <= MAX_SCORE) {
    prompt('Player Wins!');
  } else if (sumOfHand(playerHand) < sumOfHand(dealersHand)<=  MAX_SCORE) {
    prompt('Dealer Wins!');
  }

  return null;
}

//Create a function that only handles displaying the result.
//displays the result

function displayWinner() {

}

//PLAYER FUNCTIONS//

function dealersTurn() {
  let sum;
  let arrIdx = 2;
  let boardIdx = 5;

  board['1'] = displayCard(dealersHand[0]);

 do {
    displayBoard(board);

    dealersHand.push(shuffle(FIFTY_TWO_CARDS)[0]);

    board[String(boardIdx)] = displayCard(dealersHand[arrIdx]);

    sum = sumOfHand(dealersHand);

    arrIdx++;
    boardIdx += 2;
  } while (sum <= 17);

  hiddenScore = sum;

  return hiddenScore;
}

function firstTwoTurns() {
  //first drawl
  playersHand.push(shuffle(FIFTY_TWO_CARDS)[0]);
  board['0'] = displayCard(playersHand[0]);

  dealersHand.push(shuffle(FIFTY_TWO_CARDS)[0]);

  //second drawl
  playersHand.push(shuffle(FIFTY_TWO_CARDS)[0]);
  board['2'] = displayCard(playersHand[1]);

  dealersHand.push(shuffle(FIFTY_TWO_CARDS)[0]);
  board['3'] = displayCard(dealersHand[1]);

  hiddenScore = sumOfHand(dealersHand) - dealersHiddenCard(dealersHand[0][1]);
}

function playersTurn() {
  let sum = sumOfHand(playersHand);
  let handIdx = 2;
  let objIdx = 4;

 while (sum <= MAX_SCORE) {

    displayBoard(board);

    prompt("Do you want to hit or stay?");
    let answer = readline.question().toLowerCase();

    while (!HIT_STAY.includes(answer)) {
      prompt("That's not a valid answer. Do you want to hit or stay?");
      answer = readline.question().toLowerCase();
    }

    if (answer !== 'hit') break;

    playersHand.push(shuffle(FIFTY_TWO_CARDS)[0]);
    board[String(objIdx)] = displayCard(playersHand[handIdx]);
    handIdx++;
    objIdx += 2;
  };

  return null;
}

let board = initializeBoard();

while (true) {

  displayBoard(board);

  prompt('Welcome to the Simply Twenty One.\n');
  prompt("It's similar to Black Jack, except it's simple.");

  enterToContinue();

  do {

    displayBoard(board);

    firstTwoTurns();

    playersTurn();
    displayBoard(board);

    if (busted()) break;

    dealersTurn();
    displayBoard(board);

    if (busted()) break;

} while ((sumOfHand(playersHand) || sumOfHand(dealersHand)) <= MAX_SCORE);

whoWon();

prompt("Did you want to play again? Yes/No?");
let restart = readline.question().toLowerCase();

while (!NO_YES.includes(restart)) {
  prompt("That wasn't a valid answer. Yes or No?")
  restart = readline.question().toLowerCase();
}

if (restart === 'no') break;

dealersHand = [];
playersHand = [];

console.clear();
}

prompt("Thanks for playing!");
