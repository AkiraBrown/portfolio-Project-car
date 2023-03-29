const shuffledDeckURL =
  "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6";

const get_new_deck = document.getElementById("btnGND");
/*
const testCall = () => {
  fetch(shuffledDeckURL)
    .then((result) => result.json())
    .then((json) => {
      const data = { json };
      console.log(data);
      viewDeck(data);
    })
    .catch((error) => {
      console.log(error);
    });
};
*/
get_new_deck.addEventListener("click", function () {
  fetch(shuffledDeckURL)
    .then((result) => result.json())
    .then((json) => {
      const data = { json };
      console.log(data);
      viewDeck(data);
    })
    .catch((error) => {
      console.log(error);
    });
});
const viewDeck = (data) => {
  const deckID = data.json.deck_id;
  console.log(deckID);
  const drawCardTest = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=2`;
  fetch(drawCardTest)
    .then((drawnCards) => drawnCards.json())
    .then((json) => {
      const theCards = { json };
      console.log(theCards);
    });
};
