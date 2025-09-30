import { useEffect, useState } from "react";
import Deck from "../classes/Deck";
import Modal from "./common/Modal";

const CustomDeckDB = () => {
  // Fetch
  const [selectedUser, setSelectedUser] = useState(1);
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

  // Add deck
  const [isAddingDeck, setIsAddingDeck] = useState(false);

  const handleAddDeck = (event) => {
    // Prevent form submission
    event.preventDefault();
    // POST request
    setIsAddingDeck(false);
  };

  // Select deck
  const [selectedDeckIndex, setSelectedDeckIndex] = useState(0);

  const handleChangeDeck = (event) => {
    setSelectedDeckIndex(event.target.value);
  };

  // Edit deck name
  const [isEditingDeckName, setIsEditingDeckName] = useState(false);

  // Delete deck
  const handleDeleteDeck = () => {
    if (confirm("Are you sure that you want to delete this deck?")) {
      // DELETE request
    }
  };

  // Add prompt
  const [isAddingPrompt, setIsAddingPrompt] = useState(false);
  const [textareaValue, setTextareaValue] = useState("");

  const handleAddPrompt = (event) => {
    // Prevent form submission
    event.preventDefault();
    // POST request
    // Clear textarea
    setTextareaValue("");
    setIsAddingPrompt(false);
  };

  // Edit prompt
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);

  // Delete prompt
  const handleDeletePrompt = () => {
    // DELETE request
  };

  if (isLoading) {
    return <p>Loading...</p>;
  } else {
    return (
      <>
        <h1>Custom Decks</h1>{" "}
        <Modal
          modalContent={
            <>
              <p>
                Create your custom deck! First, give your custom deck a name.
                Deck names are limited to 25 characters to keep the Game Setup
                form from stretching too far.
              </p>
              <p>
                Next, add in your prompts! Prompts are limited to 130 characters
                to avoid the game board stretching too far.
              </p>
              <p>
                As long as your custom deck has at least 1 prompt, it will show
                up as a deck option in the Game Setup form. We recommend adding
                20-30 prompts to your custom deck.
              </p>
            </>
          }
        />
        <br />
        <div className="white-bg gray-hover">
          {isAddingDeck ? (
            <form className="inline-form" onSubmit={handleAddDeck}>
              <label htmlFor="new-deck">Deck name: </label>
              <input
                id="new-deck"
                type="text"
                maxLength={"25"}
                required
              ></input>
              <button>Add</button>
            </form>
          ) : (
            <button onClick={() => setIsAddingDeck(true)}>Add Deck</button>
          )}
        </div>
        <br />
        <div className="white-bg gray-hover">
          <label htmlFor="select-deck">Update deck: </label>
          <select id="select-deck" onChange={handleChangeDeck}>
            {allDecks.map((deck, index) => {
              return (
                <option key={deck.id} value={index}>
                  {deck.deckName}
                </option>
              );
            })}
          </select>
        </div>
        <h2>
          <span
            className="material-symbols-outlined shake"
            onClick={handleDeleteDeck}
          >
            delete
          </span>{" "}
          <span className="material-symbols-outlined shake">edit</span>{" "}
          {allDecks[selectedDeckIndex].deckName}
        </h2>
        <div className="white-bg gray-hover">
          {isAddingPrompt ? (
            <form onSubmit={handleAddPrompt}>
              <label htmlFor="custom-prompt">Prompt:</label>
              <br />
              <textarea
                id="custom-prompt"
                value={textareaValue}
                onChange={(event) => setTextareaValue(event.target.value)}
                rows="4"
                cols="40"
                maxLength="130"
                required
              ></textarea>
              <br />
              <button>Add</button>
            </form>
          ) : (
            <button
              onClick={() => {
                setIsAddingPrompt(true);
              }}
            >
              Add Prompt
            </button>
          )}
        </div>
        <br />
        <ul className="custom-deck-list white-bg">
          {allDecks[selectedDeckIndex].prompts.map((prompt) => {
            return (
              <li key={prompt.id} className="custom-deck-list-item">
                <span
                  className="material-symbols-outlined shake"
                  onClick={handleDeletePrompt}
                >
                  delete
                </span>{" "}
                <span className="material-symbols-outlined shake">edit</span>{" "}
                {prompt.promptText}
              </li>
            );
          })}
        </ul>
      </>
    );
  }
};

export default CustomDeckDB;
