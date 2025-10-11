import { createContext, use, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import Deck from "../classes/Deck";
import defaultData from "../defaultDecks.json";

export const DeckContext = createContext();

export const DeckContextProvider = ({ children }) => {
  const { auth } = use(AuthContext);

  // Default decks
  const [defaultDecks, setDefaultDecks] = useState([]);

  const loadDefaultDecks = () => {
    let decks = [];
    defaultData.decks.forEach((deck) => {
      let newDeck = new Deck(deck.id, deck.deckName, deck.prompts);
      decks.push(newDeck);
    });
    setDefaultDecks(decks);
  };

  // Load default decks on page load
  useEffect(() => {
    loadDefaultDecks();
  }, []);

  // Fetch custom decks
  const [isLoading, setIsLoading] = useState(true);
  const [customDecks, setCustomDecks] = useState(null);

  // Deck name if user has 0 decks
  const firstDeckName = "My First Deck";

  const fetchDecks = async () => {
    // Don't attempt fetch if user is not logged in
    if (!auth.isAuthenticated) {
      return;
    }

    const decks = [];

    try {
      const response = await fetch("http://localhost:8080/api/users", {
        headers: {
          Authorization: "Bearer " + auth.token,
        },
      });

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
      // Add deck if user has 0 decks
      if (!decks.length) {
        // POST request
        await fetch("http://localhost:8080/api/decks/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
          body: JSON.stringify({
            deckName: firstDeckName,
          }),
        });
        // Re-fetch data now that user has first deck
        fetchDecks();
      }

      setCustomDecks(decks);
    }
  };

  // Fetch on page load
  useEffect(() => {
    fetchDecks();
  }, []);

  // Fetch after login
  useEffect(() => {
    fetchDecks();
  }, [auth.isAuthenticated]);

  // Render page after fetch populates customDecks
  useEffect(() => {
    if (customDecks !== null) {
      setIsLoading(false);
    }
  }, [customDecks]);

  return (
    <DeckContext.Provider
      value={{
        defaultDecks,
        isLoading,
        customDecks,
        fetchDecks,
        firstDeckName,
      }}
    >
      {children}
    </DeckContext.Provider>
  );
};
