const shuffledDeckURL =
  "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6";

const get_new_deck = document.getElementById("btn--getNewDeck");
let deck_ID;
//let playerDeck = [];

get_new_deck.addEventListener("click", function () {
  fetch(shuffledDeckURL)
    .then((result) => result.json())
    .then((json) => {
      const data = { json };
      console.log(data);
      dealHand(data);
      //viewDeck(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

const dealHand = (data) => {
  deck_ID = data.json.deck_id;
  const draw_Cards_start = `https://deckofcardsapi.com/api/deck/${deck_ID}/draw/?count=4`;
  fetch(draw_Cards_start)
    .then((drawn_Cards) => drawn_Cards.json())
    .then((json) => {
      const cards_to_deal = { json };
      //console.log(cards_to_deal);
      const player_Hand = [];
      const deal_Hand = [];

      player_Hand.push(
        cards_to_deal.json.cards[0],
        cards_to_deal.json.cards[1]
      );
      let isDealer = false;
      deal_Hand.push(cards_to_deal.json.cards[2], cards_to_deal.json.cards[3]);
      playerDealt(player_Hand, isDealer);
      dealerDealt(deal_Hand, isDealer);
    });
};

//console.log(deck_ID);

const playerDealt = (cards, dealerCheck) => {
  const player_card_location = document.getElementById("player--hand");
  dealerCheck = false;
  //console.log(cards);
  cards.forEach((element) => {
    // console.log(element);

    createCard(player_card_location, element, dealerCheck);
  });
};
const dealerDealt = (cards, dealerCheck) => {
  const dealer_card_location = document.getElementById("dealer--hand");
  dealerCheck = true;
  for (let i = 0; i < cards.length; i++) {
    createCard(dealer_card_location, cards[i], dealerCheck, i);
  }
  //cards.forEach((element) => {});
};

const createCard = (spawnLocation, cardDetails, dealerCheck, cardIndex) => {
  const card = document.createElement("img");
  const cardBackImage = "./Images/back.jpeg";
  const cardImage = cardDetails.image;
  console.log(dealerCheck);
  console.log(cardIndex);
  if (dealerCheck === true && cardIndex === 0) {
    console.log("Dealer is signalled");
    card.setAttribute("src", `${cardBackImage}`);
    card.setAttribute("height", "157px");
    card.setAttribute("width", "113px");
  } else {
    card.setAttribute("src", `${cardImage}`);
    card.setAttribute("height", "157px");
    card.setAttribute("width", "113px");
  }

  //console.log(cardImage);

  //console.log(card);
  spawnLocation.append(card);
};

const drawOne = () => {};
