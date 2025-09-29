import { createContext, useEffect, useState } from "react";
import Deck from "../classes/Deck";

export const DeckContext = createContext();

export const DeckProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [allDecks, setAllDecks] = useState(null);

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

        console.log(data);

        data.decks.forEach((deck) => {
          let newDeck = new Deck(deck.id, deck.deckName);
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
    fetchDecks(1);
  }, []);

  useEffect(() => {
    if (allDecks !== null) {
      setIsLoading(false);
    }
  }, []);

  return (
    <DeckContext.Provider
      value={{
        isLoading,
        allDecks,
        fetchDecks,
      }}
    >
      {children}
    </DeckContext.Provider>
  );
};
