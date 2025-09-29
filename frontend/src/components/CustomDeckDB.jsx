import { useEffect, useState } from "react";
import Deck from "../classes/Deck";

const CustomDeckDB = () => {
  const [selectedUser, setSelectedUser] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [allDecks, setAllDecks] = useState(null);
  const [selectedDeckIndex, setSelectedDeckIndex] = useState(0);

  const fetchDecks = async (userId) => {
    const decks = [];

    try {
      const response = await fetch(
        "http://localhost:8080/api/users/details/" + userId
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "ERROR - Status " + response.status
        );
      } else {
        const data = await response.json();

        data.decks.forEach((deck) => {
          let newDeck = new Deck(deck.id, deck.deckName, deck.prompts);
          decks.push(newDeck);
        });
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setAllDecks(decks);
    }
  };

  useEffect(() => {
    fetchDecks(selectedUser);
  }, []);

  useEffect(() => {
    if (allDecks !== null) {
      setIsLoading(false);
    }
  }, [allDecks]);

  const handleDeckSelectChange = (event) => {
    console.log(event.target.value);
    setSelectedDeckIndex(event.target.value);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  } else {
    return (
      <>
        <h1>Custom Decks</h1>
        <br />
        <select onChange={handleDeckSelectChange}>
          {allDecks.map((deck, index) => {
            return (
              <option key={deck.id} value={index}>
                {deck.deckName}
              </option>
            );
          })}
        </select>
        <br />
        <br />
        <ul className="custom-deck-list white-bg">
          {allDecks[selectedDeckIndex].prompts.map((prompt) => {
            return <li key={prompt.id}>{prompt.promptText}</li>;
          })}
        </ul>
      </>
    );
  }
};

export default CustomDeckDB;
