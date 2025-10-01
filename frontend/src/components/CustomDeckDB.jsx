import { useEffect, useRef, useState } from "react";
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

  const handleEditDeckName = async (event) => {
    // Prevent form submission
    event.preventDefault();
    // Read form data
    const form = event.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    // POST request
    const response = await fetch(
      "http://localhost:8080/api/decks/update/" +
        allDecks[selectedDeckIndex].id,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deckName: formJson.updatedDeckName,
          userId: selectedUser,
        }),
      }
    );
    setIsEditingDeckName(false);
    fetchDecks(selectedUser);
  };

  // Delete deck
  const handleDeleteDeck = async (deckId) => {
    if (confirm("Are you sure that you want to delete this deck?")) {
      // DELETE request
      const response = await fetch(
        "http://localhost:8080/api/decks/delete/" + deckId,
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

  const handleAddPrompt = async (event) => {
    // Prevent form submission
    event.preventDefault();
    // Read form data
    const form = event.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    // POST request
    const response = await fetch("http://localhost:8080/api/prompts/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        promptText: formJson.newPromptText,
        deckId: allDecks[selectedDeckIndex].id,
      }),
    });
    // Clear textarea
    setIsAddingPrompt(false);
    fetchDecks(selectedUser);
  };

  // Edit prompt
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const editPromptRef = useRef(null);

  const handleEditPromptClick = (prompt) => {
    setIsEditingPrompt(true);
    setCurrentPrompt(prompt);
    editPromptRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleEditPrompt = async (event) => {
    // Prevent form submission
    event.preventDefault();
    // Read form data
    const form = event.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    // POST request
    const response = await fetch(
      "http://localhost:8080/api/prompts/update/" + currentPrompt.id,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promptText: formJson.updatedPromptText,
        }),
      }
    );
    setIsEditingPrompt(false);
    setCurrentPrompt(null);
    fetchDecks(selectedUser);
  };

  const handleCancelPromptClick = () => {
    setIsEditingPrompt(false);
    setCurrentPrompt(null);
  };

  // Delete prompt
  const handleDeletePrompt = async (promptId) => {
    if (confirm("Are you sure that you want to delete this prompt?")) {
      // DELETE request
      const response = await fetch(
        "http://localhost:8080/api/prompts/delete/" + promptId,
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
        {/* Add deck */}
        <div className="white-bg gray-hover">
          {isAddingDeck ? (
            <form onSubmit={handleAddDeck} className="inline-form">
              <label htmlFor="new-deck">Deck name: </label>
              <input
                id="new-deck"
                name="newDeck"
                type="text"
                maxLength={"25"}
                required
              ></input>
              <button type="submit">Add</button>
              <button type="button" onClick={() => setIsAddingDeck(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <button onClick={() => setIsAddingDeck(true)}>Add Deck</button>
          )}
        </div>
        <br />
        {/* Select deck */}
        <label htmlFor="select-deck">
          <b>Edit deck: </b>
        </label>
        <select onChange={handleChangeDeck} id="select-deck">
          {allDecks.map((deck, index) => {
            return (
              <option key={deck.id} value={index}>
                {deck.deckName}
              </option>
            );
          })}
        </select>
        {/* Edit deck name */}
        <h2>
          {isEditingDeckName ? (
            <form onSubmit={handleEditDeckName} className="inline-form">
              <input
                type="text"
                name="updatedDeckName"
                defaultValue={allDecks[selectedDeckIndex].deckName}
                maxLength={"25"}
                required
              ></input>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setIsEditingDeckName(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <>
              {allDecks[selectedDeckIndex].deckName}{" "}
              <span
                onClick={() => setIsEditingDeckName(true)}
                className="material-symbols-outlined shake"
              >
                edit
              </span>
              <span
                onClick={() => handleDeleteDeck(allDecks[selectedDeckIndex].id)}
                className="material-symbols-outlined shake"
              >
                delete
              </span>
            </>
          )}{" "}
        </h2>
        {/* Add prompt */}
        <div className="white-bg gray-hover">
          {isAddingPrompt ? (
            <form onSubmit={handleAddPrompt}>
              <label htmlFor="new-prompt">Prompt:</label>
              <br />
              <textarea
                id="new-prompt"
                name="newPromptText"
                rows="4"
                cols="40"
                maxLength="130"
                required
              ></textarea>
              <br />
              <button type="submit">Add</button>
              <button type="button" onClick={() => setIsAddingPrompt(false)}>
                Cancel
              </button>
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
        {/* Edit prompt */}
        <div ref={editPromptRef}>
          {isEditingPrompt && (
            <>
              <form onSubmit={handleEditPrompt} className="white-bg gray-hover">
                <br />
                <textarea
                  name="updatedPromptText"
                  defaultValue={currentPrompt.promptText}
                  rows="4"
                  cols="40"
                  maxLength="130"
                  required
                ></textarea>
                <br />
                <button type="submit">Save</button>
                <button type="button" onClick={handleCancelPromptClick}>
                  Cancel
                </button>
              </form>
              <br />
            </>
          )}
        </div>
        {/* Prompts list */}
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
                        <span
                          onClick={() => handleEditPromptClick(prompt)}
                          className="material-symbols-outlined shake"
                        >
                          edit
                        </span>
                      </td>
                      <td>
                        <span
                          onClick={() => handleDeletePrompt(prompt.id)}
                          className="material-symbols-outlined shake"
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
