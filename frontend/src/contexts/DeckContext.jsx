import { createContext, use, useEffect, useState } from "react";
import Deck from "../classes/Deck";
import defaultData from "../defaultDecks.json";
import { AuthContext } from "./AuthContext";

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
      const response = await fetch("http://64.225.88.28:8080/api/users", {
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
        await fetch("http://64.225.88.28:8080/api/decks/add", {
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

  const [allDecks, setAllDecks] = useState([]);

  // Set all decks to default decks when page loads
  useEffect(() => {
    setCustomDecks(defaultDecks);
  }, []);

  // Concatenate decks when customDecks changes
  useEffect(() => {
    customDecks && setAllDecks(defaultDecks.concat(customDecks));
  }, [customDecks]);

  const [selectedDeckId, setSelectedDeckId] = useState(
    localStorage.getItem("deck") || 1
  );

  const resetDeck = () => {
    setSelectedDeckId(1);
    localStorage.setItem("deck", 1);
  };

  // Reset selected deck if that deck no longer contains prompts or exists
  useEffect(() => {
    // Return if customDecks is undefined
    try {
      customDecks.length;
    } catch {
      return;
    }
    // If customDecks is populated
    if (customDecks.length) {
      try {
        // If selected deck has no prompts, reset selected decks
        if (
          allDecks.find((deck) => deck.id == selectedDeckId).prompts.length ===
          0
        ) {
          resetDeck();
        }
      } catch {
        try {
          // If selected deck is undefined, reset selected decks
          allDecks.find((deck) => deck.id == selectedDeckId).prompts.length;
        } catch {
          resetDeck();
        }
      }
    }
  }, [allDecks]);

  return (
    <DeckContext.Provider
      value={{
        defaultDecks,
        isLoading,
        customDecks,
        fetchDecks,
        firstDeckName,
        allDecks,
        selectedDeckId,
        setSelectedDeckId,
      }}
    >
      {children}
    </DeckContext.Provider>
  );
};
