const shuffledDeckURL =
  "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";

//--------------------------For the modal--------------------------//
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".close-modal");
const result_display = document.getElementById("result--h3");

const playerH3 = document.getElementById("player--h3");
const dealerH3 = document.getElementById("dealer--h3");
//-----------------------------Grabs buttons on the website--------------------------------//
const header_btn = document.getElementById("nav--h3");
const get_new_deck = document.getElementById("btn--getNewDeck");
const hit_btn = document.getElementById("btn--hit");
const stay_btn = document.getElementById("btn--stay");
const shuffle_btn = document.getElementById("btn--shuffle");
const new_game_btn = document.getElementById("btn--newGame");
let deck_ID;
let dealer_firstCard_img;

const player_score = document.getElementById("player--score");
const dealer_score = document.getElementById("dealer--score");

let playerVar_score = 0;
let dealerVar_score = 0;
let can_hit = true;

//-----------------------Grabs the player and dealer's hand------------------------------------------//
const player_card_location = document.getElementById("player--hand");
const dealer_card_location = document.getElementById("dealer--hand");
let isDealer = false;

let player_ace_count = 0;
let dealer_ace_count = 0;
//-----------------------Stores the cards that the player and dealer have------------------------------//
let player_Hand = [];
let deal_Hand = [];

let playerStatus;
let dealerStatus;

header_btn.addEventListener("click", function () {
  window.location.href = "./index.html";
});

//-------------------------------does an API call when the site is loaded so there are cards present-------------//
window.onload = function () {
  new_deck_call();
};

//-----------------When the 'get_new_deck' button is called a fresh api call get a new deck----------------------------//
get_new_deck.addEventListener("click", function () {
  new_deck_call();
});

//-------------The function that makes the API call to get a new deck------------------------------------//
const new_deck_call = () => {
  fetch(shuffledDeckURL)
    .then((result) => result.json())
    .then((json) => {
      const data = { json };
      //console.log(data);
      //passes the deck details onto another function//
      clearAll();
      dealHand(data);

      //viewDeck(data);
    })
    .catch((error) => {
      console.log(error);
    });
};

//-----------gets the data regarding the deck and gives a deck ID from the data to the global variable---------------//
const dealHand = (data) => {
  deck_ID = data.json.deck_id;
  //preps for another API call to draw 4 cards to give 2 to the player and dealer//
  const draw_Cards_start = `https://deckofcardsapi.com/api/deck/${deck_ID}/draw/?count=4`;
  fetch(draw_Cards_start)
    .then((drawn_Cards) => drawn_Cards.json())
    .then((json) => {
      //destructs the json so make location path easier to call
      const cards_to_deal = { json };
      //console.log(cards_to_deal);
      //-----------passess two cards onto the player and another two to the dealer by filling the global array-------//
      player_Hand.push(
        cards_to_deal.json.cards[0],
        cards_to_deal.json.cards[1]
      );

      deal_Hand.push(cards_to_deal.json.cards[2], cards_to_deal.json.cards[3]);
      //function call to check the dealer
      checkCardValue(player_Hand);
      playerDealt(player_Hand, isDealer);
      dealerDealt(deal_Hand, isDealer);
    });
};

//console.log(deck_ID);

const playerDealt = (cards, dealerCheck) => {
  //--------------player confirms they're not the dealer so they can create each card in their hand with no problems------//
  dealerCheck = false;
  //console.log(cards);
  cards.forEach((element) => {
    //console.log(element);

    createCard(player_card_location, element, dealerCheck);
  });
  //console.log(deck_ID);
};
const dealerDealt = (cards, dealerCheck) => {
  //---Because this is the dealer we need to ge the index of the first card and pass it on to the next function-----//
  dealerCheck = true;
  for (let i = 0; i < cards.length; i++) {
    createCard(dealer_card_location, cards[i], dealerCheck, i);
  }
  //cards.forEach((element) => {});
  //console.log(deck_ID);
};

const createCard = (spawnLocation, cardDetails, dealerCheck, cardIndex) => {
  //------creates the element that will have alternating src attributes depending on whether their the dealer--------//
  //console.log(cardDetails);
  const card = document.createElement("img");
  const cardBackImage = "./Images/back.jpeg";
  const cardImage = cardDetails.image;
  card.setAttribute("height", "157px");
  card.setAttribute("width", "113px");
  // console.log(dealerCheck);
  // console.log(cardIndex);
  if (dealerCheck === true && cardIndex === 0) {
    //console.log("Dealer is signalled");
    card.setAttribute("src", `${cardBackImage}`);
  } else {
    card.setAttribute("src", `${cardImage}`);
  }

  //----Because of the previous check for the dealer the spawn location of the card changes between the dealer and the player

  //console.log(cardImage);
  //console.log(card);
  spawnLocation.append(card);
};
//console.log(deck_ID);

const drawOne = (dealerCheck) => {
  //1. get cards location
  //--------> We do this by passing on the a parameter check like previous and putting the function call within that check
  const drawNewCard = `https://deckofcardsapi.com/api/deck/${deck_ID}/draw/?count=1`;

  //console.log(drawNewCard);
  fetch(drawNewCard)
    .then((singleCard) => singleCard.json())
    .then((json) => {
      //console.log(json);
      const raw_Card = { json };
      //console.log(raw_Card);
      const parsed_card = raw_Card.json.cards[0];

      if (dealerCheck === true) {
        deal_Hand.push(parsed_card);
        createCard(dealer_card_location, parsed_card, true, 1);
        checkCardValue(deal_Hand, true);
        check_win_or_lose(true, dealerVar_score);
      } else {
        player_Hand.push(parsed_card);
        //console.log(player_Hand);
        //console.log(typeof player_Hand);
        createCard(player_card_location, parsed_card, false, 0);
        checkCardValue(player_Hand, false);
        check_win_or_lose(false, playerVar_score);
      }
    });

  /*
  fetch(drawNewCard)
    .then((result) => result.json)
    .then((json) => {
      const new_card = { json };
      console.log(new_card);
      createCard(player_card_location, new_card, (dealerCheck = false), 0);
    });
  //2. draw 1 new card from current deck
  //3. push card into player hand
  */
};

function clearAll() {
  //1.Clear player's and dealer's hand
  //console.log(player_card_location);
  //console.log(dealer_card_location);
  while (player_card_location.firstChild) {
    player_card_location.removeChild(player_card_location.firstChild);
  }
  while (dealer_card_location.firstChild) {
    dealer_card_location.removeChild(dealer_card_location.firstChild);
  }

  player_Hand = [];
  deal_Hand = [];
  dealer_score.textContent = 0;
  player_score.textContent = 0;
  playerVar_score = 0;
  dealerVar_score = 0;

  playe_ace_count = 0;
  dealer_ace_count = 0;
  playerH3.textContent = "Player:";
  dealerH3.textContent = "Dealer:";
  //console.log(player_Hand, deal_Hand);
  //player_card_location
}

const shuffleDeck = () => {
  //m6iailms07hm
  //https://deckofcardsapi.com/api/deck/<<deck_id>>/shuffle/
  const deckToShuffle = `https://deckofcardsapi.com/api/deck/${deck_ID}/shuffle/`;
  fetch(deckToShuffle)
    .then((result) => result.json())
    .then((json) => {
      const data = { json };
      clearAll();
      dealHand(data);
    });
};

const check_win_or_lose = (dealerCheck, globalScore) => {
  if (dealerCheck) {
    //is dealer
    if (globalScore > 21) {
      dealerStatus = `BUST`;
    } else if (globalScore === 21) {
      dealerStatus = `PERFECT`;
    } else {
      dealerStatus = `UNDER`;
    }
  } else {
    //is player
    if (globalScore > 21) {
      playerStatus = `BUST`;
      can_hit = false;
    } else if (globalScore === 21) {
      playerStatus = `PERFECT`;
    } else {
      playerStatus = `UNDER`;
    }
  }
  /*
  if (globalScore > 21) {
    can_hit = false;
  }*/
};
const cardNumber = (card, aceCount) => {
  let current_card = card;
  //console.log(current_card);
  if (isNaN(current_card)) {
    if (current_card === "ACE") {
      aceCount++;

      current_card = 11;
    } else {
      current_card = 10;
    }
  } else {
    current_card = parseInt(current_card);
  }
  //console.log(current_card);
  return current_card;
};

const checkCardValue = (deck, dealerCheck) => {
  const current_deck = deck;
  let deckSum = 0;
  //let locatAceCount;
  if (dealerCheck === true) {
    //while (dealerVar_score < 17) {}
    current_deck.forEach((element) => {
      let cur_card_value = element.value;
      // console.log(cur_card_value);
      //----dealer score handle---//
      deckSum += cardNumber(cur_card_value, dealer_ace_count);
      //console.log(deckSum);
    });
    deckSum = checkAces(deckSum, dealer_ace_count);
    dealerVar_score = deckSum;
    //console.log(deckSum);
    //console.log(`Here: ${dealerVar_score}`);
    dealer_score.textContent = deckSum;
  } else {
    current_deck.forEach((element) => {
      let cur_card_value = element.value;
      //----Player score handle---//
      deckSum += cardNumber(cur_card_value, player_ace_count);
    });
    deckSum = checkAces(deckSum, player_ace_count);
    //console.log(deckSum);
    playerVar_score = deckSum;
    player_score.textContent = deckSum;
  }
  function checkAces(deck, acesCounter) {
    if (acesCounter === 2) {
      deck -= 10; //subtract 10 from selected score
    }
    return deck;
  }
  /*
    if (isNaN(cur_card_value)) {
      if (cur_card_value === "ACE") {
        cur_card_value = 11;
      } else {
        cur_card_value = 10;
      }
    } else {
      cur_card_value = parseInt(cur_card_value);
    }
    */

  //deck_value += cur_card_value;
  //console.log(cur_card_value);
  //console.log(typeof cur_card_value);
  /*
    if (dealerCheck === true) {
      dealerVar_score += cur_card_value;
      dealer_score.textContent = deck_value;
    } else {
      playerVar_score += cur_card_value;
      player_score.textContent = deck_value;
    }
    */

  console.log(`Current card value = ${deckSum}`);
};
const revealDealerCard = () => {
  //console.log(deal_Hand[0].image);
  const dealer_firstCard = dealer_card_location.firstChild;
  const firstCard_img = deal_Hand[0].image;
  //   console.log(dealer_firstCard);
  //   console.log(firstCard_img);
  dealer_firstCard.setAttribute("src", `${firstCard_img}`);
  //console.log(dealer_firstCard);
};
const dealer_turn = () => {
  revealDealerCard();
  checkCardValue(deal_Hand, true);
  drawOne(true);
  //console.log(dealerVar_score);
  winner();
  //console.log(playerStatus, dealerStatus);
};
const winner = () => {
  let player_score_diff = 21 - playerVar_score;
  let dealer_score_diff = 21 - dealerVar_score;
  let result;

  if (playerStatus === dealerStatus) {
    //if playerStatus  = bust (you both lose)
    //if playerstatus = perfect (Tie);

    if (playerStatus === `PERFECT`) {
      console.log(`you both win`);
      playerH3.textContent += `Tie`;
      dealerH3.textContent += `Tie`;
    } else if (playerStatus === `BUST`) {
      console.log(`You Both lose`);
      playerH3.textContent += `Lose`;
      dealerH3.textContent += `Lose`;
    } else if (playerStatus === "UNDER") {
      if (player_score_diff === dealer_score_diff) {
        console.log(`You both win`);
        playerH3.textContent += `Tie`;
        dealerH3.textContent += `Tie`;
      } else if (player_score_diff < dealer_score_diff) {
        console.log(`Player Wins`);
        playerH3.textContent += `Win`;
        dealerH3.textContent += `Lose`;
      } else {
        playerH3.textContent += `Lose`;
        dealerH3.textContent += `Win`;
        console.log(`You lose`);
      }
    }
  } else {
    if (playerStatus === `PERFECT`) {
      // player = perfect | dealer = bust or under
      playerH3.textContent += `Wins`;
      dealerH3.textContent += `Lose`;
      console.log(`Player Wins`);
    } else if (playerStatus === `BUST`) {
      //player = BUST | dealer = perfect or under
      console.log(`Dealer Wins`);
      dealerH3.textContent += `Wins`;
      playerH3.textContent += `Lose`;
    } else {
      if (dealerStatus === `PERFECT`) {
        //player = under | dealer = perfect
        dealerH3.textContent += `Wins`;
        playerH3.textContent += `Lose`;
        console.log(`dealer wins`);
      } else {
        //player = under | dealer = bust
        console.log(`player wins`);
        playerH3.textContent += `Wins`;
        dealerH3.textContent += `Lose`;
      }
    }
  }
  //result_display.textContent = result;
  //setTimeout(openModal, 3000);
};
/*
const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};
const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
});
*/
//-----------------------------------------Event listeners for the buttons ---------------------------------------------//
shuffle_btn.addEventListener("click", function () {
  shuffleDeck();
});

hit_btn.addEventListener("click", function () {
  if (!can_hit) {
    //dealer_turn();
  } else {
    drawOne(false); //add parameter check for is dealer and pass it the value false for player
  }
});

stay_btn.addEventListener("click", function () {
  dealer_turn();
});
new_game_btn.addEventListener("click", function () {
  can_hit = true;
  clearAll();
  shuffleDeck();
});
