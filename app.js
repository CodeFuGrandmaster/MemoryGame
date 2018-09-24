//Variables used for the score panel
var resetButton = $("fa-repeat");
var numStars = 3;
var numClicks = 0;
var numMoves = 0;
var mins = 0;
var seconds = 0;

//Variables for card functionality
var cards = ['anchor','anchor','paper-plane-o','paper-plane-o',
            'cube','cube','bolt','bolt',
            'leaf','leaf', 'diamond', 'diamond',
            'bomb', 'bomb', 'bicycle', 'bicycle'];
var openCards = [];
var deckList = $(".deck");
var deck = $(".card");

//Variables used in matching test
var curCard;
var lastCard;
var temp = "";
var lastTemp = "";
var numMatches = 0; //Used for win check


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/* This function runs when the page loads (in intialize() function)
 * and any time the game is reset. It deletes any currently existing deck.
 */
function buildDeck() {
  //Temporary variables to build the cards
  let tempHTML = '<li class="card"><i class="fa fa-';
  let tempNum = 0;
  
  //removes any currently constructed deck
  if(deckList.children())
  {
    deckList.children().remove();
  }
  
  //creates the HTML for each card itself (by getting the class
  //cards array) and
  //appends it to the deck
  while (tempNum < cards.length) {
    tempHTML += cards[tempNum];
    tempHTML += '"> </i> </li>';
    deckList.append(tempHTML);
    tempNum += 1;
    tempHTML = '<li class="card"><i class="fa fa-';
  }
  
  //ensures that the cardListener function is
  //enabled on every card that is created.
  $(".card").on("click", cardListener);
}

/* This function runs only when the page first loads. It ensures
 * that a deck is shuffled and placed and that the reset listener is on.
 */
function initialize() {
  shuffle(cards);
  buildDeck();
  $(".fa-repeat").on("click", resetGame);
  $(".reset").on("click", winReset);
  $(".close").on("click", winClose);
}

/* This function keeps track of the number of times cards has been clicked and
 * updates the number of moves made every other click.
 */
function updateMoves() {
  if(numClicks % 2 === 0 && numClicks !== 0) {numMoves += 1;}
  /* Selects and removes the moveCounter and
   * then replaces it with an updated version.
   */
  let moveCounter = $(".moves");
  moveCounter.remove();
  let tempHTML = '<span class="moves"> ' + numMoves + ' </span>';
  $(".stars").after(tempHTML);
}

/* This function uses the number of moves made so far to determine the current
 * star rating and display the star rating should it have changed.
 */
function updateStars() {
  //9 to 12 moves for an average score
  if(numMoves > 8 && numMoves < 16) {numStars = 2;}
  //13 or more moves for a poor score
  else if(numMoves > 17) {numStars = 1;}
  //8 moves for a perfect score
  else {numStars = 3;}
  
  let star2 = $(".fa-star:eq(1)");
  let star3 = $(".fa-star:eq(2)");
  
  switch(numStars)
  {
    case 1: {
      star3.css("color", "red");
      star2.css("color", "red");
      break;
    }
    case 2: {
      star3.css("color", "red");
      break;
    }
    case 3: {
      break;
    }
    default: {
      // alert("Error.");
    }
  }
}

/* This function runs constantly while the player has yet to win.
 */
function updateTimer() {
  let tempHTML;
  let timer = $(".timer");
  timer.remove();
  seconds += 1;
  if(seconds == 60) {
    mins += 1;
    seconds = 0;
  }
  if(seconds < 10) {
    tempHTML = '<span class="timer">' + mins + ':0' + seconds  + '</span>';
  }
  else {
    tempHTML = '<span class="timer">' + mins + ':' + seconds  + '</span>';
  }
  $(".timer-box").append(tempHTML);
}


//Need to figure out actually making win message and stopping timer, then I'm done.
function makeWinMessage() {
  let winBox = $(".win-message");
  let tempHTML = "";
  
  winBox.children().remove();
  
  tempHTML = "<div class='buttons'>"
            + "<button type='button' class='reset button'> Play again? </button>"
            + "<button type='button' class='close button'> Close window </button></div>";
  
  winBox.append(tempHTML);
  
  if(numMoves === 8) {
    tempHTML = "<h2>WOW! Perfect Score!</h2>";
  }
  else if(numMoves < 16) {
    tempHTML = "<h2>Great Job!</h2>";
  }
  else if(numMoves < 24) {
    tempHTML = "<h2>Not Bad!</h2>";
  }
  else {
    tempHTML = "<h2>Keep at it!</h2>";
  }
  
  tempHTML += "<span class='start'>You won in " + mins + " minute(s) and "
            + seconds + " second(s) in a total of " + numMoves + "moves."
            + " You earned a rating of " + numStars + " Stars.</span>";
  winBox.prepend(tempHTML);
}

function messageButtons() {
  $(".reset button").on("click", winReset);
  $(".close button").on("click", winClose);
}

function winReset() {
  $(".win-message").removeClass("show-win");
  resetCards();
  resetGame();
}

function winClose() {
  $(".win-message").removeClass("show-win");
  resetCards();
}


/* This function will run after every full move, with the purpose
 * of using two other function calls to track and display the number
 * of moves made and the subsequent star rating.
 */
function updateGameState() {
  updateMoves();
  updateStars();
  
  if(numMatches === 8) {
    makeWinMessage();
    messageButtons();
    $(".win-message").addClass("show-win");
    clearInterval(updateTimer);
  }
}

/* This function is called by the reset button and resets the game.
 * Also called when player wins and wants to start a new game.
 */
function resetGame() {
  shuffle(cards);
  buildDeck();
  
  $(".fa-star").css("color", "green");
  numStars = 3;

  mins = 0;
  seconds = -1;
  updateTimer();
  
  numMoves = 0;
  numClicks = 0;
  numMatches = 0;
  updateMoves();
}

/* This function is called both when a match is made and not.
 * It hides cards that were not matches and cleans up the HTML of ones that were,
 * then it turns the event listener for clicking on a card back on, and
 * finally makes sure that the event listener is then turned off
 * again for any cards that have already been matched.
 */
function resetCards() {
  curCard.removeClass("show open");
  lastCard.removeClass("show open");
  $(".card").on("click", cardListener);
  $(".match").off("click", cardListener);
}

/* This function will be called every time a card that has not already
 * been matched, or was just previously clicked and is still displayed,
 * is clicked.
 */
function cardListener() {
  /*increases the number of clicks, 1 move is 2 clicks
   * (see below and updateMoves() function)
   */
  numClicks += 1;
  /* Grabs the card that was clicked on, gets which symbol it is,
   * turns the click listener off (to ensure no erroneous moves
   * are added by clicking on the same card), and displays it.
   */
  curCard = $(this);
  temp = $(this).children().attr("class");
  curCard.off("click", cardListener);
  curCard.addClass("open show");
  
  /* If no other cards are displayed, set this as the displayed card.
   */
  if(openCards.length === 0) {
    openCards.push(temp);
    lastTemp = temp; //sets the symbol of this card for next card to match against
    temp = "b"; //arbitrary value, but must be different from lastTemp (see below)
    lastCard = curCard;
  }
  
  /* Checks if there is a card that is already being displayed and it's at least
   * the first full move that is being made (checks for full moves with % 2 === 0).
   */
  if(openCards.length === 1 && ((numClicks >= 2) && (numClicks % 2 === 0))) {
    $(".card").off("click", cardListener);
    /* Check the cards are the same symbol, but not the same card. If so,
     * set the cards classes to 'match' and reset the symbols to be safe.
     * Also clear the currently displayed cards and re-enable all others.
     */
    if((temp === lastTemp) && (curCard != lastCard)) {
      openCards.pop();
      lastTemp = "a";
      temp = "b";
      curCard.addClass("match");
      lastCard.addClass("match");
      numMatches += 1;
      
      /* 500ms delay to show cards for half a second and ensure other cards can't be
       * displayed while checking for a match by clicking on another card too quickly.
       */
      setTimeout(resetCards, 500);
      
    }
    /* If there is no match, clear the currently displayed cards,
     * reset the symbols to be safe, and re-enable all cards.
     */
    else {
      openCards.pop();
      lastTemp = "a";
      temp = "b";
      /* 500ms delay to show cards for half a second and ensure other cards can't be
       * displayed while checking for a match by clicking on another card too quickly.
       */
      setTimeout(resetCards, 500);
    }
  }
  
  updateGameState();
}

//Initializes the game when the page is loading and starts timer
if($(document).ready()) {
  initialize();
  setInterval(updateTimer, 1000);
}