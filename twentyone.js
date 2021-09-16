//Game play//
const readline = require('readline-sync');
const emptyDisplay = '            ';
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
const MAX_SCORE = 21;

let dealersHand = [];
let hiddenScore = 0;
let playersHand = [];

function displayBoard(board) {
  console.clear();

  console.log('|              |              |');
  console.log(`|  PLAYER: ${sumOfHand(playersHand)}  |  DEALER: ${dealerScoreSpacing(hiddenScore)}  |`);
  console.log('|--------------|--------------|');
  console.log(`| ${board['0']} | ${board['1']} |`);
  console.log(`| ${board['2']} | ${board['3']} |`);
  console.log(`| ${board['4']} | ${board['5']} |`);
  console.log(`| ${board['6']} | ${board['7']} |`);
  console.log(`| ${board['8']} | ${board['9']} |`);
  console.log(`| ${board['10']} | ${board['11']} |`);
  console.log('|--------------|--------------|');
}

function dealerScoreSpacing(hiddenScore) {
  if (hiddenScore.length === 1) {
    return hiddenScore + ' ';
  } else {
   return hiddenScore;
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
    obj[String(idx)] = emptyDisplay;
  }

  return obj;
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

}

//Create a function that only handles displaying the result.
//displays the result

function displayWinner() {

}

//Player functions//

function dealerMoves() {
  let sum = sumOfHand(dealerHand);

  while (sum <= 17) {
    dealersHand.push(shuffle(FIFTY_TWO_CARDS)[0]);
    sum += sumOfHand(dealersHand);

  }

  hiddenScore = sum;

  return hiddenScore;
}

function firstTwoTurns() {
  playersHand.push(shuffle(FIFTY_TWO_CARDS)[0]);
  board['0'] = displayCard(playersHand[0]);

  dealersHand.push(shuffle(FIFTY_TWO_CARDS)[0]);

  hiddenScore = sumOfHand(dealersHand) - Number(dealersHand[0][1]);

  displayBoard(board);

  playersHand.push(shuffle(FIFTY_TWO_CARDS)[0]);
  board['2'] = displayCard(playersHand[1]);

  dealersHand.push(shuffle(FIFTY_TWO_CARDS)[0]);
  board['3'] = displayCard(dealersHand[1]);

  hiddenScore = sumOfHand(dealersHand) - Number(dealersHand[0][1]);
}

function playersTurn() {
  let sum = sumOfHand(playersHand);
  let handIdx = 2;
  let objIdx = 4;

  while (true) {
    displayBoard(board);

    console.log("hit or stay?");
    let answer = readline.question().toLowerCase();

    if (answer === 'stay') break;

    playersHand.push(shuffle(FIFTY_TWO_CARDS)[0]);

    board[String(objIdx)] = displayCard(playersHand[handIdx]);

    handIdx++;
    objIdx += 2;

//  if (busted()) {
  // prob end the game? or ask the user to play again?
//  } else {
 //   console.log("You chose to stay!");
  }
}

let board = initializeBoard();

while (true) {
  displayBoard(board);
//intro to the game
//ask them if they are ready to start;
  firstTwoTurns();
  playersTurn();
}
