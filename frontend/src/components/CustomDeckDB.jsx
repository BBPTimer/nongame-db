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

  const handleAddDeck = async (event) => {
    // Prevent form submission
    event.preventDefault();
    // Read form data
    const form = event.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    // POST request
    const response = await fetch("http://localhost:8080/api/decks/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deckName: formJson.newDeck,
        userId: selectedUser,
      }),
    });
    setIsAddingDeck(false);
    fetchDecks(selectedUser);
    alert(formJson.newDeck + " deck added!");
  };

  // Select deck
  const [selectedDeckIndex, setSelectedDeckIndex] = useState(0);

  const handleChangeDeck = (event) => {
    setSelectedDeckIndex(event.target.value);
  };

  // Edit deck name
  const [isEditingDeckName, setIsEditingDeckName] = useState(false);

  // Delete deck
  const handleDeleteDeck = async (id) => {
    if (confirm("Are you sure that you want to delete this deck?")) {
      // DELETE request
      const response = await fetch(
        "http://localhost:8080/api/decks/delete/" + id,
        {
          method: "DELETE",
        }
      );
      setSelectedDeckIndex(0);
      fetchDecks(selectedUser);
    }
  };

  // Add prompt
  const [isAddingPrompt, setIsAddingPrompt] = useState(false);
  const [textareaValue, setTextareaValue] = useState("");

  const handleAddPrompt = async (event) => {
    // Prevent form submission
    event.preventDefault();
    // POST request
    const response = await fetch("http://localhost:8080/api/prompts/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        promptText: textareaValue,
        deckId: allDecks[selectedDeckIndex].id,
      }),
    });
    // Clear textarea
    setTextareaValue("");
    setIsAddingPrompt(false);
    fetchDecks(selectedUser);
  };

  // Edit prompt
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);

  // Delete prompt
  const handleDeletePrompt = async (id) => {
    if (confirm("Are you sure that you want to delete this prompt?")) {
      // DELETE request
      const response = await fetch(
        "http://localhost:8080/api/prompts/delete/" + id,
        {
          method: "DELETE",
        }
      );
      fetchDecks(selectedUser);
    }
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
                name="newDeck"
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

        <label htmlFor="select-deck">
          <b>Update deck: </b>
        </label>
        <select id="select-deck" onChange={handleChangeDeck}>
          {allDecks.map((deck, index) => {
            return (
              <option key={deck.id} value={index}>
                {deck.deckName}
              </option>
            );
          })}
        </select>

        <h2>
          {allDecks[selectedDeckIndex].deckName}{" "}
          <span className="material-symbols-outlined shake">edit</span>
          <span
            className="material-symbols-outlined shake"
            onClick={() => handleDeleteDeck(allDecks[selectedDeckIndex].id)}
          >
            delete
          </span>{" "}
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

        <div className="white-bg gray-hover custom-deck-list">
          {allDecks[selectedDeckIndex].prompts.length == 0 ? (
            <span>Add your first prompt to get started!</span>
          ) : (
            <table>
              <tbody>
                {allDecks[selectedDeckIndex].prompts.map((prompt) => {
                  return (
                    <tr key={prompt.id}>
                      <td className="custom-deck-list-item" width={"100%"}>
                        {prompt.promptText}
                      </td>
                      <td>
                        <span className="material-symbols-outlined shake">
                          edit
                        </span>
                      </td>
                      <td>
                        <span
                          className="material-symbols-outlined shake"
                          onClick={() => handleDeletePrompt(prompt.id)}
                        >
                          delete
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </>
    );
  }
};

export default CustomDeckDB;
