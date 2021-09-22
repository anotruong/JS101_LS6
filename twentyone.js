//Game play//
const readline = require('readline-sync');
const CARD_DECK = [
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
const EMPTY_DISPLAY = '            ';
const GAME_BORDER = '|--------------|--------------|';
const HIT_STAY = ['hit', 'stay'];
const MAX_POINTS = 5;
const MAX_SCORE = 21;
const NO_YES = ['yes', 'no'];

let dealersHand = [];
let dealersPoints = 0;
let hiddenHand = 0;
let playersHand = [];
let playersPoints = 0;

//DISPLAY BOARD INFO//

function displayBoard(board) {
  console.clear();

  console.log('');
  console.log('|______B L A C K J A C K______|');
  console.log('|                             |');
  console.log(`|  PLAYER: ${kerning(playersPoints)}  |  DEALER: ${kerning(dealersPoints)}  |`);
  console.log('|  _________   |  _________   |');
  console.log(`|      ${kerning(sumOfHand(playersHand))}      |      ${kerning(hiddenHand)}      |`);
  console.log(GAME_BORDER);
  console.log(`| ${board['0']} | ${board['1']} |`);
  console.log(`| ${board['2']} | ${board['3']} |`);
  console.log(`| ${board['4']} | ${board['5']} |`);
  console.log(`| ${board['6']} | ${board['7']} |`);
  console.log(`| ${board['8']} | ${board['9']} |`);
  console.log(`| ${board['10']} | ${board['11']} |`);
  console.log(GAME_BORDER);
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
  let winner = '';

  if (sumOfHand(playersHand) > MAX_SCORE) {
    winner = 'Dealer';
  } else if (sumOfHand(dealersHand) > MAX_SCORE) {
    winner = 'Player';
  }
  return winner;
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
  }
}

function instantWin() {
  return sumOfHand(playersHand) === MAX_SCORE;
}

function shuffle(CARD_DECK) {
  for (let idx = CARD_DECK.length - 1; idx > 0; idx--) {
    let secIdx = Math.floor(Math.random() * (idx + 1)); // 0 to index
    [CARD_DECK[idx], CARD_DECK[secIdx]] = [CARD_DECK[secIdx], CARD_DECK[idx]];
  }
  return CARD_DECK;
}

function sumOfHand(cards) {
  let values = cards.map(card => card[1]);

  let sum = 0;
  values.forEach(value => {
    if (value === "A") {
      sum += 11;
    } else if (['J', 'Q', 'K'].includes(value)) {
      sum += 10;
    } else {
      sum += Number(value);
    }
  });

  values.filter(value => value === "A").forEach(_ => {
    if (sum > 21) sum -= 10;
  });

  return sum;
}

//Create a function that only returns the result of the game
//calculating the result.

function calculateRound() {
  let dealersTotal = sumOfHand(dealersHand);
  let playersTotal = sumOfHand(playersHand);
  let winner;

  if (!busted()) {
    if ((dealersTotal < playersTotal) || (playersTotal === MAX_SCORE)) {
      winner = 'Player';
    } else if ((playersTotal < dealersTotal) || (dealersTotal === MAX_SCORE)) {
      winner = 'Dealer';
    } else if (playersTotal === dealersTotal) {
      winner = 'No one';
    }
  } else {
    winner = busted();
  }

  return winner;
}

function calculateOverallWinner() {
  let winner = '';

  if (dealersPoints < playersPoints) {
    winner = 'Player';
  } else if (dealersPoints > playersPoints) {
    winner = 'Dealer';
  }

  return winner;
}

function displayRoundWinner() {
  prompt(`${calculateRound()} gets a point for this round.`);
}

function displayOverallWinner() {
  prompt(`${calculateOverallWinner()} won!\n`);
  prompt(`Woooooo, congratulations ${calculateOverallWinner()}!!!!\n`);
  prompt('*insert confetticannon.gif*');
}

let board = initializeBoard();

//PLAYER FUNCTIONS//

function dealersTurn() {
  let sum;
  let arrIdx = 2;
  let boardIdx = 5;

  board['1'] = displayCard(dealersHand[0]);

  do {
    displayBoard(board);

    dealersHand.push(shuffle(CARD_DECK)[0]);

    board[String(boardIdx)] = displayCard(dealersHand[arrIdx]);

    sum = sumOfHand(dealersHand);

    if (busted()) break;
    arrIdx++;
    boardIdx += 2;
  } while (sum <= 17);

  hiddenHand = sum;

  return hiddenHand;
}

function firstTwoTurns() {
  //first drawl
  playersHand.push(shuffle(CARD_DECK)[0]);
  board['0'] = displayCard(playersHand[0]);

  dealersHand.push(shuffle(CARD_DECK)[0]);
  displayBoard(board);

  enterToContinue();

  //second drawl
  playersHand.push(shuffle(CARD_DECK)[0]);
  board['2'] = displayCard(playersHand[1]);

  dealersHand.push(shuffle(CARD_DECK)[0]);
  board['3'] = displayCard(dealersHand[1]);

  hiddenHand = sumOfHand(dealersHand) - dealersHiddenCard(dealersHand[0][1]);
}

function playersTurn() {
  let sum = sumOfHand(playersHand);
  let handIdx = 2;
  let objIdx = 4;

  while ((sum <= MAX_SCORE) && (!busted())) {

    displayBoard(board);

    let answer = readline.question('=> Do you want to hit or stay?\n').toLowerCase();

    while (!HIT_STAY.includes(answer)) {
      prompt("That's not a valid answer. Do you want to hit or stay?");
      answer = readline.question().toLowerCase();
    }

    if (answer !== 'hit') break;

    playersHand.push(shuffle(CARD_DECK)[0]);
    board[String(objIdx)] = displayCard(playersHand[handIdx]);

    handIdx++;
    objIdx += 2;
    sum = sumOfHand(playersHand);
  }
}

//GAME LOOP//

while (true) {

  displayBoard(board);

  prompt('Welcome to the Simply Twenty One.\n');
  prompt("It's similar to Black Jack, except it's simple.");

  enterToContinue();

  while (true) {

    do {

      displayBoard(board);

      firstTwoTurns();

      playersTurn();
      displayBoard(board);

      if (busted()) break;
      if (instantWin()) break;

      dealersTurn();
      displayBoard(board);

      break;

    } while ((sumOfHand(playersHand) || sumOfHand(dealersHand)) <= MAX_SCORE);

    if (calculateRound() === 'Player') {
      playersPoints++;
    } else if (calculateRound() === 'Dealer') {
      dealersPoints++;
    }

    displayRoundWinner();

    enterToContinue();

    if (dealersPoints === MAX_POINTS) break;
    if (playersPoints === MAX_POINTS) break;

    dealersHand = [];
    playersHand = [];

    hiddenHand = 0;

    board = initializeBoard();

    console.clear();

  } //while ((dealersPoints) || (playersPoints) < MAX_POINTS);

  displayBoard(board);
  displayOverallWinner();

  enterToContinue();
  displayBoard(board);

  prompt("Did you want to play again? Yes/No?");
  let restart = readline.question().toLowerCase();

  while (!NO_YES.includes(restart)) {
    prompt("That wasn't a valid answer. Yes or No?");
    restart = readline.question().toLowerCase();
  }

  if (restart !== 'yes') break;

  dealersHand = [];
  playersHand = [];

  hiddenHand = 0;

  board = initializeBoard();

  console.clear();
}

prompt("Thanks for playing!");
